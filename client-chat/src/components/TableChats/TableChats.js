import { useState } from "react";
import ItemChat from "../ItemChat";
import PanelChat from "../PanelChat";
//TODO espera mostrar todos los chat que puede tener de sus contactos pero agregandolos de arriba los que tienen chats hechos y abajo los que no
const TableChats = (props) => {
  const { chats, user, sendMessage, onInitialMessages } = props;
  const [recertorUser, setRecertorUser] = useState(null);

  const onClickUser = (response) => {
    setRecertorUser(response);
  };

  return (
    <div className="container">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ minWidth: 300 }}>
          <div>Chats de {user.username}</div>
          {chats.map((item, index) => {
            return (
              <ItemChat
                key={index}
                user={item.user}
                onClick={() => onClickUser(item)}
                active={recertorUser && recertorUser.user.id === item.user.id}
              />
            );
          })}
        </div>
        <div style={{ flex: 1 }}>
          {recertorUser && (
            <PanelChat
              sendMessage={sendMessage}
              recertorUser={recertorUser}
              user={user}
              onInitialMessages={onInitialMessages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableChats;
