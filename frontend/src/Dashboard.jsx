import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("connect", () => {
      socketRef.current.emit("getMessages");
    });

    socketRef.current.on("messages", (msgs) => {
      setMessages(msgs);
    });

    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socketRef.current.emit("message", { text: input });
      setInput("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0, color: "#fff" }}>Chat</h2>
        <div style={styles.userEmail}>{user?.email || "Usuario"}</div>
      </div>

      <div ref={chatRef} style={styles.chatArea}>
        {messages.map((msg, idx) => {
          const isMine = msg.user?.email === user?.email;
          return (
            <div
              key={idx}
              style={{
                ...styles.messageContainer,
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor: isMine ? "#dcf8c6" : "#ffffff",
                  alignSelf: isMine ? "flex-end" : "flex-start",
                }}
              >
                {!isMine && (
                  <div style={styles.sender}>{msg.user?.email || "Anon"}:</div>
                )}
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>Enviar</button>
      </form>
    </div>
  );
}

// 🎨 Estilos tipo WhatsApp
const styles = {
  container: {
    maxWidth: 500,
    margin: "40px auto",
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: "#075E54",
    padding: "12px 16px",
  },
  userEmail: {
    color: "#cfcfcf",
    fontSize: 14,
    marginTop: 4,
  },
  chatArea: {
    height: 400,
    backgroundColor: "#e5ddd5",
    padding: "12px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  messageContainer: {
    display: "flex",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 14,
    lineHeight: "1.4",
    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
  },
  sender: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: 20,
    border: "1px solid #ccc",
    outline: "none",
    fontSize: 14,
    marginRight: 8,
  },
  sendButton: {
    padding: "10px 16px",
    backgroundColor: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: "bold",
  },
};
