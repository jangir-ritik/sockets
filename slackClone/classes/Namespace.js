class Namespace {
  constructor(id, name, image, endpoint) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(roomObj) {
    this.rooms.push(roomObj);
  }

  getRoomById(roomId) {
    // console.log("Looking for room:", {
    //   searchingFor: roomId,
    //   typeOf: typeof roomId,
    //   availableRooms: this.rooms.map((r) => ({
    //     id: r.roomId,
    //     typeOf: typeof r.roomId,
    //     title: r.roomTitle,
    //   })),
    // });

    // Convert roomId to number since it comes as string from client
    const room = this.rooms.find(
      (room) => room.roomId === parseInt(roomId, 10)
    );

    if (!room) {
      console.log("No room found with ID:", roomId);
    } else {
      console.log("Found room:", JSON.stringify(room));
    }

    return room;
  }
}

module.exports = Namespace;
