"use client"

import { useState } from "react"
import "./css/AISetting.css"

function AISettings({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    apiProvider: localStorage.getItem("ai_provider") || "auto",
    temperature: parseFloat(localStorage.getItem("ai_temperature")) || 0.7,
    maxTokens: parseInt(localStorage.getItem("ai_max_tokens")) || 500,
    language: localStorage.getItem("ai_language") || "vietnamese",
  })

  const handleSave = () => {
    localStorage.setItem("ai_provider", settings.apiProvider)
    localStorage.setItem("ai_temperature", settings.temperature.toString())
    localStorage.setItem("ai_max_tokens", settings.maxTokens.toString())
    localStorage.setItem("ai_language", settings.language)
    alert("Cài đặt đã được lưu!")
    onClose()
  }

  const apiProviders = [
    { value: "auto", label: "Tự động (thử tất cả API)" },
    { value: "openai", label: "OpenAI GPT-3.5/4" },
    { value: "groq", label: "Groq (Llama 3)" },
    { value: "local", label: "Local AI (Ollama)" },
    { value: "huggingface", label: "HuggingFace" },
    { value: "simulation", label: "Simulation (không cần API)" },
  ]

  if (!isOpen) return null

  return (
    <div className="ai-settings-overlay">
      <div className="ai-settings-container">
        {/* Header */}
        <div className="settings-header">
          <h3>⚙️ Cài đặt AI Assistant</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="settings-body">

          {/* API Provider */}
          <div className="setting-group">
            <label>API Provider:</label>
            <select
              value={settings.apiProvider}
              onChange={(e) =>
                setSettings({ ...settings, apiProvider: e.target.value })
              }
            >
              {apiProviders.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
            <small>Chọn nhà cung cấp AI. "Tự động" sẽ thử tất cả API có sẵn.</small>
          </div>

          {/* Temperature */}
          <div className="setting-group">
            <label>Temperature: {settings.temperature}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) =>
                setSettings({ ...settings, temperature: parseFloat(e.target.value) })
              }
            />
            <small>Độ sáng tạo của AI (0 = chính xác, 1 = sáng tạo)</small>
          </div>

          {/* Max Tokens */}
          <div className="setting-group">
            <label>Max Tokens:</label>
            <input
              type="number"
              min="100"
              max="2000"
              value={settings.maxTokens}
              onChange={(e) =>
                setSettings({ ...settings, maxTokens: parseInt(e.target.value) })
              }
            />
            <small>Độ dài tối đa của câu trả lời</small>
          </div>

          {/* Language */}
          <div className="setting-group">
            <label>Ngôn ngữ trả lời:</label>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
            >
              <option value="vietnamese">Tiếng Việt</option>
              <option value="english">English</option>
              <option value="mixed">Hỗn hợp</option>
            </select>
          </div>

          {/* API Status */}
          <div className="api-status">
            <h4>Trạng thái API:</h4>
            <div className="status-list">
              <div className="status-item">
                <span className="status-dot available"></span>
                OpenAI: {process.env.REACT_APP_OPENAI_API_KEY ? "Có sẵn" : "Chưa cấu hình"}
              </div>
              <div className="status-item">
                <span className="status-dot available"></span>
                Groq: {process.env.REACT_APP_GROQ_API_KEY ? "Có sẵn" : "Chưa cấu hình"}
              </div>
              <div className="status-item">
                <span className="status-dot available"></span>
                Simulation: Luôn có sẵn
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={handleSave}>Lưu cài đặt</button>
        </div>
      </div>
    </div>
  )
}

export default AISettings
