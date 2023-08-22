import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from "./logo.svg";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import userAction from "./actions/userAction";
import socket from "./components/socket";
import TableChats from "./components/TableChats/TableChats";
import userUtils from "./utils/userUtils";

//TODO chats
/* allChats
  user: {...data}
  messages: [...data]
  index: index
*/

function App() {
  const [userLogin, setUserLogin] = useState({ id: 1 }); //self with default login with 1
  const [isChat, setIsChat] = useState(false); //open scena chat

  const [allChats, setAllChats] = useState([]);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setIsChat(false);
      }
    });
    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //TODO consola eventos recividos
    socket.on("private message", (data) => {
      const auxAll = [...allChats];
      const newAuxAllChats = auxAll.map((item) => {
        if (item.index === data.index) {
          item.messages.push(data);
        }
        return item;
      });
      setAllChats(newAuxAllChats);
    });
    socket.on("user connected", (user) => {
      console.log(user);
      const auxAllChats = [...allChats];
      auxAllChats.forEach((chat) => {
        if (chat.user.username === user.username) {
          chat.user.isOnline = true;
        }
      });
      setAllChats(auxAllChats);
    });
    socket.on("users", (users) => {
      console.log(users);
      const auxAllChats = [...allChats];
      users.forEach((user) => {
        auxAllChats.forEach((chat) => {
          if (chat.user.username === user.username) {
            chat.user.isOnline = true;
          }
        });
      });
      setAllChats(auxAllChats);
    });

    // //TODO aplica solo uno mismo
    // socket.on("disconnect", () => {
    //   const auxAllChats = [...allChats];
    //   auxAllChats.forEach((user) => {
    //     if (user.user.self) {
    //       user.user.isOnline = false;
    //     }
    //   });
    //   setAllChats(auxAllChats);
    // });
    return () => {
      socket.off("user connected");
      socket.off("users");
      socket.off("private message");
      //socket.off("disconnect");
    };
  }, [allChats]);

  //TODO conecta con los dos usuarios para recuperar su informacion
  //TODO activa el chat
  const openChat = () => {
    const promiseA = new Promise((resolve, reject) => {
      userAction.getUser({ id: userLogin.id }, (response) => {
        setUserLogin(response);
        resolve(response);
      });
    });
    const promiseAllFriends = new Promise((resolve, reject) => {
      userAction.getUsersWithoutMe({ id: userLogin.id }, (response) => {
        const auxAllChats = response.map((chat, i) => {
          return {
            user: chat,
            messages: [],
            index: userUtils.generedChatPrivateIndex(userLogin, chat),
          };
        });

        setAllChats(auxAllChats);
        resolve(response);
      });
    });

    Promise.all([promiseA, promiseAllFriends]).then((response) => {
      socket.auth = { ...response[0], uuid : response[0].id  };
      socket.connect();
      setIsChat(true);
    });
  };

  const sendMessage = (response) => {
    const index = userUtils.generedChatPrivateIndex(userLogin, {
      id: response.to,
    });
    const request = {
      message: response.message,
      index: index, //olny from strapi
      creator: userLogin.id,
      receiver: response.to,
    };
    socket.emit("private message", {
      content: request,
      from: userLogin.id,
      to: response.to,
    });
  };

  const onInitialMessages = (messages, index) => {
    const newAuxAllChats = allChats.map((item, i) => {
      if (item.index === index) {
        item.messages = messages;
      }
      return item;
    });
    setAllChats(newAuxAllChats);
  };

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
                  value={userLogin.id}
                  onChange={(e) =>
                    setUserLogin({ ...userLogin, id: e.target.value })
                  }
                />
                <Button variant="primary" onClick={openChat}>
                  chatear
                </Button>
              </Col>
            </Row>
          </div>
        )}
        {isChat && (
          <TableChats
            user={userLogin}
            chats={allChats}
            sendMessage={sendMessage}
            onInitialMessages={onInitialMessages}
          />
        )}
      </header>
    </div>
  );
}

export default App;
