require("dotenv").config();
const http = require("http");
const server = http.createServer();
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

const callMessage = async (request) => {
  let data = null;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_DOMAIN_CMS}/api/chat-directlies`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: request,
        }),
      }
    );
    const responseData = await response.json();
    data = responseData.data;
  } catch (_) {
    console.log(_);
  }

  return data;
};

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  const users = [];

  //TODO registra a los usuarios logeados
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      //userID: id,
      userID: socket.handshake.auth.uuid,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  //TODO socket.broadcast.emit("user connected" emitirá a todos los clientes conectados, excepto al socketpropio
  //TODO io.emit("user connected", ...)habría enviado el evento "usuario conectado" a todos los clientes conectados, incluido el nuevo usuario.
  socket.broadcast.emit("user connected", {
    //userID: socket.id,
    userID: socket.handshake.auth.uuid,
    username: socket.username,
  });

  //crea el room con el nombre del id del usuario para poder enviar contenido separados
  //TODO podria crear el index de usuario a to usuario b
  socket.join(socket.handshake.auth.uuid);

  socket.on("private message", async ({ content, from, to }) => {
    const response = await callMessage(content);
    if (response !== null) {
      console.log(from)
      io.to(from).emit("private message", response); //TODO uso io para poder mandarlo al remitente sin eso no lo envia
      socket.to(to).emit("private message", response);
    }
  });
});

server.listen(3001);
