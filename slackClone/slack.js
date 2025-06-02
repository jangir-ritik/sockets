const express = require("express");
const app = express();
const socketio = require("socket.io");
const namespaces = require("./data/namespaces");
const Room = require("./classes/Room");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

app.get("/updateNamespaces", (req, res) => {
  namespaces[0].addRoom(new Room(0, "Red Room for naughty people", 0));
  io.of(namespaces[0].endpoint).emit("roomListUpdate", namespaces[0]);
  res.json(namespaces[0]);
});

io.on("connection", (socket) => {
  console.log(socket.id, "has connected");
  socket.emit("welcome", "Welcome to the server");
  socket.emit("nsList", namespaces);
});

namespaces.forEach((namespace) => {
  // Create namespace instance
  const nsIO = io.of(namespace.endpoint);

  nsIO.on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has connected to ${namespace.endpoint}`);

    nsSocket.on("requestToJoinRoomFromClient", (data, ack) => {
      // console.log("Join room request:", {
      //   data,
      //   namespaceId: namespace.id,
      //   availableRooms: namespace.rooms.map((r) => ({
      //     id: r.roomId,
      //     title: r.roomTitle,
      //   })),
      // });

      const room = namespace.getRoomById(data.roomId);
      if (!room) {
        console.log("Room not found:", {
          requestedId: data.roomId,
          typeOf: typeof data.roomId,
        });
        return;
      }

      // Join the room
      nsSocket.join(room.roomTitle);
      ack("Room joined");
      // console.log(
      //   `Socket ${nsSocket.id} joined room: ${room.roomTitle} with id: ${room.roomId}`
      // );

      // Emit back to the client
      // nsSocket.emit("joinedRoom", {
      //   roomId: room.roomId,
      //   roomTitle: room.roomTitle,
      // });
    });
  });
});
