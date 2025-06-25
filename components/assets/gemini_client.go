package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gorilla/websocket"
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
type GeminiAPIResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func main() {
	flag.Parse()
	c, _, err := websocket.DefaultDialer.Dial("ws://localhost:8080/ws", nil)
	if err != nil {
		log.Fatal("Dial error:", err)
	}
	defer c.Close()

	history := []Message{}
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Println("Start chatting with Gemini (type 'exit' to quit):")
	for {
		fmt.Print("You: ")
		if !scanner.Scan() {
			break
		}
		input := strings.TrimSpace(scanner.Text())
		if input == "exit" {
			break
		}
		history = append(history, Message{Role: "user", Parts: []Part{{Text: input}}})
		req := GeminiRequest{History: history}
		msg, err := json.Marshal(req)
		if err != nil {
			log.Println("Marshal error:", err)
			continue
		}
		if err := c.WriteMessage(websocket.TextMessage, msg); err != nil {
			log.Println("Write error:", err)
			break
		}
		_, resp, err := c.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}
		var geminiResp GeminiAPIResponse
		if err := json.Unmarshal(resp, &geminiResp); err == nil &&
			len(geminiResp.Candidates) > 0 &&
			len(geminiResp.Candidates[0].Content.Parts) > 0 {
			fmt.Printf("Gemini: %s\n", geminiResp.Candidates[0].Content.Parts[0].Text)
			history = append(history, Message{Role: "model", Parts: []Part{{Text: geminiResp.Candidates[0].Content.Parts[0].Text}}})
		} else {
			fmt.Printf("Gemini: %s\n", string(resp))
			history = append(history, Message{Role: "model", Parts: []Part{{Text: string(resp)}}})
		}
	}
} 