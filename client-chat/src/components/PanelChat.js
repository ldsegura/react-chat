import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import messageAction from "../actions/messageAction";
import userUtils from "../utils/userUtils";

const PanelChat = (props) => {
  //TODO user is the self
  const { user, recertorUser, onInitialMessages } = props;
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const index = userUtils.generedChatPrivateIndex(user, recertorUser.user);
    messageAction.getMessages({ index: index }, (response) => {
      onInitialMessages && onInitialMessages(response, index);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, recertorUser]);

  const sendMessage = () => {
    const {sendMessage} = props;
    sendMessage && sendMessage({message: newMessage, to: recertorUser.user.id});
    setNewMessage("");
  }
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Chat</Card.Title>
        <small>Aqui mostrara tus chats</small>
        <hr />
        <ul style={{ paddingLeft: 0 }}>
          {recertorUser.messages.map((item, i) => {
            const positionStartUser = parseInt(item.creator) === user.id;
            const text = positionStartUser ? "text-start" : "text-end";
            return (
              <li
                key={i}
                className={`${text}`}
                style={{ listStyleType: "none" }}
              >
                {positionStartUser && (
                  <>
                    <div>{`De ${user.username}:`}</div>
                    <small>{item.message}</small>
                  </>
                )}
                {!positionStartUser && (
                  <>
                    <div>{`De ${recertorUser.user.username}:`}</div>
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
  );
};

export default PanelChat;
