import React, { useState, useRef, useEffect } from "react"
import { aiService } from "../services/aiService"
import "./css/AIChat.css"

function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn ôn tập tiếng Anh, giải thích ngữ pháp, và trả lời các câu hỏi về bài học. Bạn cần hỗ trợ gì?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState("ready")
  const messagesEndRef = useRef(null)

  const quickQuestions = [
    "Giải thích thì hiện tại đơn",
    "Phân biệt 'a' và 'an'",
    "Cách dùng 'have' và 'has'",
    "Giải thích câu điều kiện loại 1",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setApiStatus("loading")

    try {
      const response = await aiService.sendMessage(message)

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.content,
        timestamp: new Date(),
        provider: response.provider,
      }

      setMessages((prev) => [...prev, aiMessage])
      setApiStatus("success")
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
        timestamp: new Date(),
        isError: true,
      }

      setMessages((prev) => [...prev, errorMessage])
      setApiStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusIndicator = () => {
    switch (apiStatus) {
      case "loading":
        return <span className="status-indicator loading">🔄</span>
      case "success":
        return <span className="status-indicator success">✅</span>
      case "error":
        return <span className="status-indicator error">❌</span>
      default:
        return <span className="status-indicator ready">🤖</span>
    }
  }

  if (!isOpen) return null

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <div className="header-left">
            <h3>AI Trợ lý học tập</h3>
            {getStatusIndicator()}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.type} ${message.isError ? "error" : ""}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-meta">
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
                {message.provider && (
                  <span className="message-provider">{message.provider}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message ai loading">
              <div className="message-content">
                <div className="typing-indicator">💭 Đang suy nghĩ...</div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* <div className="quick-questions">
          <p className="quick-questions-title">Câu hỏi gợi ý:</p>
          <div className="quick-questions-list">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div> */}

        <div className="ai-chat-input">
          <div className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={isLoading}
              rows={2}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
            >
              {isLoading ? "⏳" : "📤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChat
