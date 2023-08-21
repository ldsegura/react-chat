require('dotenv').config();
const http = require("http");
const server = http.createServer();
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

const callMessage = async (request) => {
  let data = null;

  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN_CMS}/api/chat-directlies`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: request,
        })
      });
    const responseData = await response.json();
    data = responseData.data;
  }
  catch(_) {
    console.log(_)
  }

  return data;
}

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  console.log("se conecto un pelana");

  socket.on("chat_private", async (data) => {
    //TODO envia a todos los clientes conectados
    const request = await callMessage(data);
    console.log(request)
    //TODO el pedo como le digo que me envie solo al chat privado y no a los existentes
    request !== null && io.emit("chat_private", request);
  });
});

server.listen(3001);
