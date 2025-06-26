import React, { useState, useRef, useEffect } from 'react';

// Chat message type
interface Message {
  role: 'user' | 'model';
  text: string;
}

export function Navbar() {
  // State for chat panel visibility, input, chat history, and WebSocket connection
  const [showPanel, setShowPanel] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Get WebSocket URL - use deployed URL in production, localhost in development
  const getWebSocketUrl = () => {
    if (typeof window !== 'undefined') {
      // If we're in the browser, check if we're on localhost
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalhost) {
        return 'ws://localhost:8080/ws';
      } else {
        // For Cloud Run deployment, always use WSS (secure WebSocket)
        // Cloud Run services are always served over HTTPS
        const host = window.location.host;
        return `wss://${host}/ws`;
      }
    }
    // Fallback for server-side rendering
    return 'ws://localhost:8080/ws';
  };

  // WebSocket setup and teardown
  useEffect(() => {
    if (showPanel && !ws.current) {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);
      console.log('Current location:', window.location.href);
      console.log('Host:', window.location.host);
      console.log('Protocol:', window.location.protocol);
      console.log('Is localhost:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      
      try {
        ws.current = new WebSocket(wsUrl);
        ws.current.onopen = () => {
          console.log('WebSocket connected successfully');
          setWsConnected(true);
        };
        ws.current.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          console.log('Close event details:', event);
          setWsConnected(false);
        };
        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          console.error('WebSocket readyState:', ws.current?.readyState);
          setWsConnected(false);
        };
        ws.current.onmessage = (event) => {
          console.log('Received message:', event.data);
          // Handle incoming messages from backend
          try {
            const data = JSON.parse(event.data);
            if (data.error) {
              console.error('Server error:', data.error);
              setChat((prev) => [...prev, { role: 'model', text: `Error: ${data.error}` }]);
              return;
            }
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
              setChat((prev) => [...prev, { role: 'model', text: data.candidates[0].content.parts[0].text }]);
            } else {
              setChat((prev) => [...prev, { role: 'model', text: event.data }]);
            }
          } catch (parseError) {
            console.error('Failed to parse message:', parseError);
            console.error('Raw message data:', event.data);
            setChat((prev) => [...prev, { role: 'model', text: `Received: ${event.data}` }]);
          }
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        setWsConnected(false);
        setChat((prev) => [...prev, { role: 'model', text: `Connection error: ${error}` }]);
      }
    }
    return () => {
      if (!showPanel && ws.current) {
        console.log('Closing WebSocket connection');
        ws.current.close();
        ws.current = null;
        setWsConnected(false);
      }
    };
  }, [showPanel]);

  // Send user message to backend
  const sendMessage = () => {
    if (!input.trim() || !ws.current || ws.current.readyState !== 1) return;
    const newChat: Message[] = [...chat, { role: 'user' as 'user', text: input }];
    setChat(newChat);
    const history = newChat.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));
    ws.current.send(JSON.stringify({ history }));
    setInput('');
  };

  // Handle Enter key in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Render Navbar, AI chat panel, and AIbutton
  return (
    <>
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <button className="search-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 15.5L11.5 11.5M13.1667 7.33333C13.1667 10.555 10.555 13.1667 7.33333 13.1667C4.11167 13.1667 1.5 10.555 1.5 7.33333C1.5 4.11167 4.11167 1.5 7.33333 1.5C10.555 1.5 13.1667 4.11167 13.1667 7.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Search for:
            </button>
          </div>
          <div className="top-bar-right">
            <a href="" className="support-link">Support</a>
            <a href="" className="login-link">Log in</a>
          </div>
        </div>
      </div>
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <img src="https://www.alpha-sense.com/wp-content/uploads/2022/09/Logo.svg" alt="AlphaSense" />
          </div>
          <nav className="nav-links">
            <a href="">Platform</a>
            <a href="">Solutions</a>
            <a href="">Customers</a>
            <a href="">Resources</a>
            <a href="">About Us</a>
            <a href="">Pricing</a>
          </nav>
          <div className="navbar-actions">
            <button className="trialbutton">Start my free trial</button>
          </div>
        </div>
      </header>
      <div></div>
      {showPanel && (
        <div className="ai-bottom-panel">
          <div className="ai-bottom-panel-header">
            AI Chat
          </div>
          <div className="ai-bottom-panel-content" style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 8 }}>
            {chat.length === 0 && <div style={{ color: '#888', textAlign: 'center', margin: '16px 0' }}>Start a conversation...</div>}
            {chat.map((msg, idx) => (
              <div key={idx} style={{
                margin: '8px 0',
                textAlign: msg.role === 'user' ? 'right' : 'left',
                color: msg.role === 'user' ? '#1e59fd' : '#222',
                fontWeight: msg.role === 'user' ? 600 : 400
              }}>
                {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            className="ai-chat-input"
            placeholder={wsConnected ? "Type your message..." : "Connecting..."}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!wsConnected}
            style={{ width: '80%', alignSelf: 'center',padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0' }}
          />
        </div>
      )}
      <div className="AIbutton" onClick={() => setShowPanel(v => !v)}><img src="https://cdn-icons-png.flaticon.com/512/3106/3106784.png"/></div>
    </>
  );
} 