package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"context"
	"cloud.google.com/go/bigtable"
	"time"
	"github.com/gorilla/websocket"
	"github.com/google/uuid"
)

const (
	apiKeyFile   = "apikey"
	geminiAPIURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key="

	bigtableProject      = "gen-lang-client-0254620528"
	bigtableInstance     = "allmind-oa"
	bigtableTable        = "allmind_chat_logs"
	bigtableColumnFamily = "chat_history"
)

type Part struct {
	Text string `json:"text"`
}

type Message struct {
	Role  string `json:"role"`
	Parts []Part `json:"parts"`
}

type GeminiRequest struct {
	History []Message `json:"history"`
}

type GeminiAPIRequest struct {
	Contents []map[string]interface{} `json:"contents"`
}

type GeminiAPIResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func getAPIKey() (string, error) {
	data, err := ioutil.ReadFile(apiKeyFile)
	if err != nil {
		return "", err
	}
	return string(bytes.TrimSpace(data)), nil
}

func writeMessageToBigtable(sessionID, role, text string) error {
	ctx := context.Background()
	client, err := bigtable.NewClient(ctx, bigtableProject, bigtableInstance)
	if err != nil {
		return err
	}
	defer client.Close()
	tbl := client.Open(bigtableTable)
	rowKey := sessionID + "#" + fmt.Sprintf("%d", time.Now().UnixNano())
	mut := bigtable.NewMutation()
	mut.Set(bigtableColumnFamily, "role", bigtable.Now(), []byte(role))
	mut.Set(bigtableColumnFamily, "text", bigtable.Now(), []byte(text))
	return tbl.Apply(ctx, rowKey, mut)
}

func geminiWSHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("WebSocket request received: %s %s", r.Method, r.URL.Path)
	log.Printf("Headers: %v", r.Header)
	
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()
	
	log.Println("WebSocket connection established")

	sessionID := uuid.New().String()
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}
		log.Printf("Received message: %s", string(msg))
		
		var req GeminiRequest
		if err := json.Unmarshal(msg, &req); err != nil {
			log.Println("JSON unmarshal error:", err)
			conn.WriteMessage(websocket.TextMessage, []byte(`{"error":"Invalid request"}`))
			continue
		}
		apiKey, err := getAPIKey()
		if err != nil {
			log.Println("API key error:", err)
			conn.WriteMessage(websocket.TextMessage, []byte(`{"error":"API key error"}`))
			continue
		}
		// Store user messages in Bigtable
		for _, m := range req.History {
			if len(m.Parts) > 0 {
				_ = writeMessageToBigtable(sessionID, m.Role, m.Parts[0].Text)
			}
		}
		// Convert history to Gemini API format
		var contents []map[string]interface{}
		for _, m := range req.History {
			contents = append(contents, map[string]interface{}{"role": m.Role, "parts": m.Parts})
		}
		geminiReq := GeminiAPIRequest{
			Contents: contents,
		}
		body, err := json.Marshal(geminiReq)
		if err != nil {
			log.Println("JSON marshal error:", err)
			conn.WriteMessage(websocket.TextMessage, []byte(`{"error":"Failed to encode request"}`))
			continue
		}
		resp, err := http.Post(geminiAPIURL+apiKey, "application/json", bytes.NewReader(body))
		if err != nil {
			log.Println("Gemini API request error:", err)
			conn.WriteMessage(websocket.TextMessage, []byte(`{"error":"Gemini API error"}`))
			continue
		}
		respBody, err := ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			log.Println("Gemini API response read error:", err)
			conn.WriteMessage(websocket.TextMessage, []byte(`{"error":"Failed to read Gemini response"}`))
			continue
		}
		// Extract Gemini response text
		var geminiResp GeminiAPIResponse
		var modelText string
		if err := json.Unmarshal(respBody, &geminiResp); err == nil &&
			len(geminiResp.Candidates) > 0 &&
			len(geminiResp.Candidates[0].Content.Parts) > 0 {
			modelText = geminiResp.Candidates[0].Content.Parts[0].Text
		} else {
			modelText = string(respBody)
		}
		_ = writeMessageToBigtable(sessionID, "model", modelText)
		history := append(req.History, Message{Role: "model", Parts: []Part{{Text: modelText}}})
		log.Printf("Current conversation history: %+v\n", history)
		conn.WriteMessage(websocket.TextMessage, respBody)
	}
}

// Serve static files from Next.js build
func staticFileHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Static file request: %s %s", r.Method, r.URL.Path)
	
	// Remove leading slash
	path := strings.TrimPrefix(r.URL.Path, "/")

	// Correctly map /_next/static/* to .next/static/*
	if strings.HasPrefix(path, "_next/static/") {
		staticPath := filepath.Join(".next", "static", strings.TrimPrefix(path, "_next/static/"))
		if _, err := os.Stat(staticPath); err == nil {
			log.Printf("Serving Next.js static file: %s", staticPath)
			http.ServeFile(w, r, staticPath)
			return
		} else {
			log.Printf("Next.js static file not found: %s", staticPath)
			http.NotFound(w, r)
			return
		}
	}
	
	// Handle root path
	if path == "" {
		indexPath := filepath.Join(".next", "server", "pages", "index.html")
		if _, err := os.Stat(indexPath); err == nil {
			log.Printf("Serving index.html for root path")
			http.ServeFile(w, r, indexPath)
			return
		}
	}
	
	// Try to serve from public directory
	publicPath := filepath.Join("public", path)
	if _, err := os.Stat(publicPath); err == nil {
		log.Printf("Serving public file: %s", publicPath)
		http.ServeFile(w, r, publicPath)
		return
	}

	// Only serve index.html for navigation routes (no file extension)
	if !strings.Contains(path, ".") {
		indexPath := filepath.Join(".next", "server", "pages", "index.html")
		if _, err := os.Stat(indexPath); err == nil {
			log.Printf("Serving index.html for SPA routing")
			http.ServeFile(w, r, indexPath)
			return
		}
	}

	// Otherwise, return 404
	log.Printf("File not found: %s", path)
	http.NotFound(w, r)
}

func main() {
	if len(os.Args) > 1 && os.Args[1] == "client" {
		// WebSocket client
		prompt := "Hello, Gemini!"
		if len(os.Args) > 2 {
			prompt = os.Args[2]
		}
		c, _, err := websocket.DefaultDialer.Dial("ws://localhost:8080/ws", nil)
		if err != nil {
			log.Fatal("Dial error:", err)
		}
		defer c.Close()
		clientReq := GeminiRequest{History: []Message{{Role: "user", Parts: []Part{{Text: prompt}}}}}
		msg, _ := json.Marshal(clientReq)
		if err := c.WriteMessage(websocket.TextMessage, msg); err != nil {
			log.Fatal("Write error:", err)
		}
		_, resp, err := c.ReadMessage()
		if err != nil {
			log.Fatal("Read error:", err)
		}
		fmt.Println(string(resp))
		return
	}
	
	// Get port from environment variable, default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	// Create a new mux to handle routes properly
	mux := http.NewServeMux()
	
	// Handle WebSocket route first (before static files)
	mux.HandleFunc("/ws", geminiWSHandler)
	
	// Handle all other routes with static file handler
	mux.HandleFunc("/", staticFileHandler)
	
	fmt.Printf("Server running on port %s\n", port)
	fmt.Printf("WebSocket endpoint: ws://localhost:%s/ws\n", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
} 