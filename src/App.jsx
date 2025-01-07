import "./App.css"
import { useRef, useState, useEffect } from "react"

const App = () => {

    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [isLoadingReply, setIsLoadingReply] = useState(false)
    const sentMessageRef = useRef(null)

    const sendMessage = () => {
        if (!inputValue.trim()) return
        setMessages((prev) => [
            ...prev,
            { text: inputValue, side: "right", id: Date.now() },
            { isLoading: true, side: "left", id: Date.now() + 1 }
        ])
        setInputValue("")
        setIsLoadingReply(true)
    }

    useEffect(() => {
        let timer
        if (isLoadingReply) {
            timer = setTimeout(() => {
            setMessages((prev) => {
                const withoutLoading = prev.filter((m) => !m.isLoading)
                return [
                    ...withoutLoading,
                    {
                        text: "The client, Maria Lopez, a 30-year-old lawful permanent resident (LPR), is seeking to petition for her spouse, Carlos Lopez, a 32-year-old citizen of Mexico, to join her in the United States. Carlos is currently residing in Mexico. Maria and Carlos married in 2019 and have maintained a continuous and bona fide marital relationship since. Maria has stable employment in the U.S., earning approximately $45,000 annually.",
                        side: "left",
                        id: Date.now()
                    }
                ]
            })
            setIsLoadingReply(false)
            }, 2000)
        }

        return () => clearTimeout(timer)
        }, [isLoadingReply])

    useEffect(() => {
        if (sentMessageRef.current) {
            sentMessageRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    return (
    <div className="app">
        <nav>
            <div className="nav-title">
                FARMA CHAT
            </div>
            <div className="nav-subtitle">
                Farmacia Gómez de Agüero
            </div>
        </nav>
        <div className="chat">
            {messages.map((message, index) => (
                <div key={message.id} ref={message.side === "right" && index === messages.length - 2 ? sentMessageRef : null} className={(message.side === "right" ? "chat-right" : "chat-left") + " " + (message.type === "title" ? "chat-title" : "") + " " + (message.type === "bullet" ? "chat-bullet" : "")}>
                    {message.isLoading ? <div className="loading-spinner"></div> : message.text}
                </div>
            ))}
            <div className="chat-input-wrapper">
                <div className="chat-input-bar">
                <input className="chat-input" placeholder="Escribe tu mensaje aqui." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    <button className="chat-send" onClick={sendMessage}>ENVIAR</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default App