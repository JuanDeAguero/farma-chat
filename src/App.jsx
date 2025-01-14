import "./App.css"
import { useRef, useState, useEffect } from "react"

const App = () => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoadingReply, setIsLoadingReply] = useState(false)
  const sentMessageRef = useRef(null)

  const [threadId, setThreadId] = useState(null)

  // 1) On first load, request a new thread from the server
  useEffect(() => {
    const createNewThread = async () => {
      try {
        const response = await fetch("https://farmachat.net/thread", { method: "GET" })
        if (!response.ok) {
          throw new Error(`Error creating thread: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        setThreadId(data.threadId)
      } catch (error) {
        console.error("Error creating thread:", error)
      }
    }

    createNewThread()
  }, [])

  // 2) Send the user’s message to the server, then display the server's reply
  const sendMessage = async () => {
    if (!inputValue.trim()) return
    // If the thread ID is not ready yet, you can decide how to handle it (e.g. disable input, show error, etc.)
    if (!threadId) {
      console.error("No thread ID available. Please wait for the thread to be created or reload the page.")
      return
    }

    // Create a new "user" message
    const userMessage = {
      text: inputValue,
      side: "right",
      id: Date.now()
    }

    // Create a "loading" placeholder for the incoming server response
    const loadingMessage = {
      side: "left",
      id: Date.now() + 1,
      isLoading: true
    }

    // Add both messages to state
    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setInputValue("")
    setIsLoadingReply(true)

    try {
      const response = await fetch("https://farmachat.net/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          threadId
        })
      })

      if (!response.ok) {
        throw new Error(`Error sending message: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // The server returns an array like `data.messages[0][0].text.value`, adapt as needed:
      const serverReplyText = data?.messages?.[0]?.[0]?.text?.value || "No response received."

      // Remove the loading message, then add the actual server reply
      setMessages((prevMessages) => {
        const withoutLoading = prevMessages.filter((m) => !m.isLoading)
        return [
          ...withoutLoading,
          {
            text: serverReplyText,
            side: "left",
            id: Date.now() + 2
          }
        ]
      })
    } catch (error) {
      console.error("Error sending message:", error)

      // Remove loading message
      setMessages((prevMessages) => prevMessages.filter((m) => !m.isLoading))

      // Optionally add an error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Error sending message. Please try again later.",
          side: "left",
          id: Date.now() + 3
        }
      ])
    } finally {
      setIsLoadingReply(false)
    }
  }

  // Scroll to the latest user message or server reply
  useEffect(() => {
    if (sentMessageRef.current) {
      sentMessageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="app">
      <nav>
        <div className="nav-title">ChatGDA</div>
        <div className="nav-subtitle">Farmacia Gómez de Agüero</div>
      </nav>

      <div className="chat">
        {messages.map((message, index) => {
          // Assign `ref` to the second-to-last message if it's from the user
          const isLastRightMessage = message.side === "right" && index === messages.length - 2
          return (
            <div
              key={message.id}
              ref={isLastRightMessage ? sentMessageRef : null}
              className={
                (message.side === "right" ? "chat-right" : "chat-left") +
                (message.type === "title" ? " chat-title" : "") +
                (message.type === "bullet" ? " chat-bullet" : "")
              }
            >
              {message.isLoading ? <div className="loading-spinner"></div> : message.text}
            </div>
          )
        })}
        
        <div className="chat-input-wrapper">
          <div className="chat-input-bar">
            <input
              className="chat-input"
              placeholder="Escribe tu mensaje aqui."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="chat-send" onClick={sendMessage}>
              ENVIAR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App