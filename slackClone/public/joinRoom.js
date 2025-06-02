const joinRoom = (roomId, namespaceId, roomTitle, activeNamespaceSocket) => {
  activeNamespaceSocket.emit(
    "requestToJoinRoomFromClient",
    {
      roomId,
      namespaceId,
      roomTitle,
    },
    (ack) => {
      console.log(ack);
    }
  );
  console.log("requestToJoinRoomFromClient", {
    roomId,
    namespaceId,
    roomTitle,
  });
};
