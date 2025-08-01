class AIService {
  constructor() {
    this.apiKey = "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";
    this.endpoint = "https://api.groq.com/openai/v1/chat/completions";
    this.model = "llama3-70b-8192";
  }

  async sendMessage(message) {
    if (!this.apiKey) {
      return {
        content: "Bạn chưa cấu hình API Key cho Groq.",
        provider: "Groq",
        success: false,
      };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "Bạn là một trợ lý AI chuyên về tiếng Anh. Hãy trả lời bằng tiếng Việt và giúp học viên học tiếng Anh hiệu quả.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        provider: "Groq",
        success: true,
      };
    } catch (error) {
      console.error("Groq error:", error);
      return {
        content: "Lỗi khi gọi tới Groq API. Vui lòng thử lại.",
        provider: "Groq",
        success: false,
      };
    }
  }
}

export const aiService = new AIService();

// class AIService {
//   constructor() {
//     this.providers = [
//       {
//         name: "OpenAI",
//         apiKey: process.env.REACT_APP_OPENAI_API_KEY,
//         endpoint: "https://api.openai.com/v1/chat/completions",
//         model: "gpt-3.5-turbo",
//         priority: 1,
//       },
//       {
//         name: "Groq",
//         apiKey: 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,
//         endpoint: "https://api.groq.com/openai/v1/chat/completions",
//         model: "mixtral-8x7b-32768",
//         priority: 2,
//       },
//       {
//         name: "HuggingFace",
//         apiKey: process.env.REACT_APP_HUGGINGFACE_API_KEY,
//         endpoint: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
//         priority: 3,
//       },
//       {
//         name: "Cohere",
//         apiKey: process.env.REACT_APP_COHERE_API_KEY,
//         endpoint: "https://api.cohere.ai/v1/generate",
//         priority: 4,
//       },
//     ]

//     this.currentProvider = null
//     this.fallbackIndex = 0
//   }

//   async sendMessage(message) {
//     // Try providers in order of priority
//     const sortedProviders = this.providers.filter((p) => p.apiKey).sort((a, b) => a.priority - b.priority)

//     for (let i = this.fallbackIndex; i < sortedProviders.length; i++) {
//       const provider = sortedProviders[i]

//       try {
//         const response = await this.callProvider(provider, message)
//         this.currentProvider = provider.name
//         this.fallbackIndex = i // Remember successful provider
//         return {
//           content: response,
//           provider: provider.name,
//           success: true,
//         }
//       } catch (error) {
//         console.warn(`${provider.name} failed:`, error.message)
//         continue
//       }
//     }

//     // If all providers fail, use simulation
//     return this.simulateResponse(message)
//   }

//   async callProvider(provider, message) {
//     const startTime = Date.now()

//     try {
//       let response

//       switch (provider.name) {
//         case "OpenAI":
//         case "Groq":
//           response = await this.callOpenAICompatible(provider, message)
//           break
//         case "HuggingFace":
//           response = await this.callHuggingFace(provider, message)
//           break
//         case "Cohere":
//           response = await this.callCohere(provider, message)
//           break
//         default:
//           throw new Error(`Unknown provider: ${provider.name}`)
//       }

//       const endTime = Date.now()
//       this.logAPICall(provider.name, true, endTime - startTime)

//       return response
//     } catch (error) {
//       const endTime = Date.now()
//       this.logAPICall(provider.name, false, endTime - startTime, error.message)
//       throw error
//     }
//   }

//   async callOpenAICompatible(provider, message) {
//     const response = await fetch(provider.endpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${provider.apiKey}`,
//       },
//       body: JSON.stringify({
//         model: provider.model,
//         messages: [
//           {
//             role: "system",
//             content:
//               "Bạn là một trợ lý AI chuyên về tiếng Anh. Hãy trả lời bằng tiếng Việt và giúp học viên học tiếng Anh hiệu quả.",
//           },
//           {
//             role: "user",
//             content: message,
//           },
//         ],
//         max_tokens: 500,
//         temperature: 0.7,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//     }

//     const data = await response.json()
//     return data.choices[0].message.content
//   }

//   async callHuggingFace(provider, message) {
//     const response = await fetch(provider.endpoint, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${provider.apiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         inputs: message,
//         parameters: {
//           max_length: 200,
//           temperature: 0.7,
//         },
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//     }

//     const data = await response.json()
//     return data[0].generated_text || "Xin lỗi, tôi không thể trả lời câu hỏi này."
//   }

//   async callCohere(provider, message) {
//     const response = await fetch(provider.endpoint, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${provider.apiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt: `Trả lời câu hỏi sau bằng tiếng Việt về học tiếng Anh: ${message}`,
//         max_tokens: 200,
//         temperature: 0.7,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//     }

//     const data = await response.json()
//     return data.generations[0].text.trim()
//   }

//   simulateResponse(message) {
//     const responses = [
//       "Đây là một câu hỏi hay! Để học tiếng Anh hiệu quả, bạn nên luyện tập thường xuyên và đa dạng các kỹ năng.",
//       "Tôi hiểu câu hỏi của bạn. Hãy thử chia nhỏ vấn đề và học từng phần một cách có hệ thống.",
//       "Câu hỏi rất thú vị! Trong tiếng Anh, điều quan trọng là phải hiểu ngữ cảnh và cách sử dụng.",
//       "Để trả lời câu hỏi này, tôi khuyên bạn nên xem xét các ví dụ cụ thể và luyện tập nhiều hơn.",
//       "Đây là một chủ đề quan trọng trong tiếng Anh. Hãy bắt đầu với những kiến thức cơ bản nhất.",
//     ]

//     const randomResponse = responses[Math.floor(Math.random() * responses.length)]

//     return {
//       content: randomResponse,
//       provider: "Simulation",
//       success: true,
//     }
//   }

//   logAPICall(provider, success, responseTime, error = null) {
//     const logEntry = {
//       timestamp: new Date().toISOString(),
//       provider,
//       success,
//       responseTime,
//       error,
//     }

//     console.log("API Call Log:", logEntry)

//     // Store in localStorage for monitoring
//     const logs = JSON.parse(localStorage.getItem("aiApiLogs") || "[]")
//     logs.push(logEntry)

//     // Keep only last 100 logs
//     if (logs.length > 100) {
//       logs.splice(0, logs.length - 100)
//     }

//     localStorage.setItem("aiApiLogs", JSON.stringify(logs))
//   }

//   getApiLogs() {
//     return JSON.parse(localStorage.getItem("aiApiLogs") || "[]")
//   }

//   getCurrentProvider() {
//     return this.currentProvider || "None"
//   }

//   getProviderStatus() {
//     return this.providers.map((p) => ({
//       name: p.name,
//       hasApiKey: !!p.apiKey,
//       priority: p.priority,
//     }))
//   }
// }

// export const aiService = new AIService()
