import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from "./logo.svg";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import userAction from "./actions/userAction";
import messageAction from "./actions/messageAction";
import socket from "./components/socket";

function App() {
  const [id, setId] = useState("1");
  const [recertorId, setReceptorId] = useState("2");
  const [userA, setUserA] = useState({ id: 0 });
  const [userB, setUserB] = useState({ id: 0 });

  const [isConnected, setIsConnected] = useState(false);
  const [isChat, setIsChat] = useState(false);

  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    //socket.on("connect", () => setIsConnected(true));
    //TODO consola eventos recividos
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    socket.on("chat_private", (data) => {
      console.log(data, "cambios")
      setMessage((message) => [...message, data]);
    });

    return () => {
      //socket.off("connect");
      socket.off("chat_private");
      socket.off("connect_error");
    };
  }, []);
  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      setIsConnected(false);
      setIsChat(false);
    }
  });
  //TODO conecta con los dos usuarios para recuperar su informacion
  //TODO activa el chat
  const openChat = () => {
    const promiseA = new Promise((resolve, reject) => {
      userAction.getUser({ id: id }, (response) => {
        console.log(`recupero el usuario ${response.username}`);
        setUserA(response);
        resolve(response);
      });
    });
    const promiseB = new Promise((resolve, reject) => {
      userAction.getUser({ id: recertorId }, (response) => {
        console.log(`recupero el usuario ${response.username}`);
        setUserB(response);
        resolve(response);
      });
    });

    //TODO index para identificar el titulo del chat ya que strapi no tengo un where o and
    //TODO crea el llamado iniaciar cuando activa el chat
    const index = id < recertorId ? `${id}-${recertorId}`: `${recertorId}-${id}`;
    const promiseMessage = new Promise((resolve, reject) => {
      messageAction.getMessages({ index: index }, (response) => {
        setMessage(response);
        resolve(response);
      });
    });

    Promise.all([promiseA, promiseB, promiseMessage]).then((response) => {
      //console.log(response)
      socket.auth = { ...response[0] };
      socket.connect();
      setIsConnected(true);
      setIsChat(true);
      // if (isConnected) {
      //   setIsChat(true);
      // }
    });
  };

  const sendMessage = () => {
    const index = id < recertorId ? `${id}-${recertorId}`: `${recertorId}-${id}`;
    socket.emit("chat_private", {
      user: socket.id,
      creator: id,
      receiver: recertorId,
      message: newMessage,
      index: index
    });
    setNewMessage("");
  };
  console.log(message)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <br></br>
        {!isChat && (
          <div className="container">
            <Row>
              <Col className="text-left">
                <Form.Label htmlFor="inputPassword5">
                  Mi ID de usuario <small>(# numero)</small>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="inputPassword5"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                <Form.Label htmlFor="inputPassword6">
                  ID de usuario a contactar <small>(# numero)</small>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="inputPassword6"
                  value={recertorId}
                  onChange={(e) => setReceptorId(e.target.value)}
                />
                <Button variant="primary" onClick={openChat}>
                  chatear
                </Button>
              </Col>
            </Row>
          </div>
        )}
        {isChat && (
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Chat</Card.Title>
              <small>Aqui mostrara tus chats</small>
              <hr />
              <ul style={{paddingLeft: 0}}>
                {message.map((item, i) => {
                  const positionStartUser = parseInt(item.creator) === userA.id;
                  const text = positionStartUser ? "text-start" : "text-end";
                  return (
                    <li key={i} className={`${text}`} style={{listStyleType: "none"}}>
                      {positionStartUser && (
                        <>
                        <div>{`De ${userA.username}:`}</div>
                          <small>{item.message}</small>
                        </>
                      )}
                      {!positionStartUser && (
                        <>
                          <div>{`De ${userB.username}:`}</div>
                          <small>{item.message}</small>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Form.Label htmlFor="escribe">Escribe tu mensaje</Form.Label>
              <Form.Control
                type="text"
                id="escribe"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="primary" onClick={sendMessage}>
                Enviar
              </Button>
            </Card.Body>
          </Card>
        )}
      </header>
    </div>
  );
}

export default App;
