import "./App.css"

const App = () => {
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
            <div className="chat-right">
                bla bla bla
            </div>
            <div className="chat-left">
                bla bla bla
            </div>
            <div className="chat-input-wrapper">
                <div className="chat-input-bar">
                    <input className="chat-input" placeholder="Escribe tu mensaje aqui." />
                    <button className="chat-send">ENVIAR</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default App