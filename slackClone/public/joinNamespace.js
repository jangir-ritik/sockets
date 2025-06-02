// const joinRoom = require("./joinRoom");

let activeNamespaceSocket = null;
let activeNamespaceEndpoint = null; // Track current namespace endpoint

const joinNamespace = (el, nsData) => {
  const nsEndpoint = el.getAttribute("data-namespace-endpoint");

  // Early return if already connected to this namespace
  if (activeNamespaceEndpoint === nsEndpoint) {
    console.log(`Already connected to namespace: ${nsEndpoint}`);
    return;
  }

  // Find the clicked namespace data
  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);
  if (!clickedNs) {
    console.error("Namespace not found:", nsEndpoint);
    return;
  }

  // Disconnect from previous namespace only if switching
  if (activeNamespaceSocket) {
    console.log(`Disconnecting from: ${activeNamespaceEndpoint}`);
    activeNamespaceSocket.disconnect();
    activeNamespaceSocket = null;
  }

  // Connect to new namespace
  console.log(`Connecting to namespace: ${nsEndpoint}`);
  activeNamespaceSocket = io(`http://localhost:9000${nsEndpoint}`);
  activeNamespaceEndpoint = nsEndpoint;

  // Set up connection event handler
  activeNamespaceSocket.on("connect", () => {
    console.log(`✅ Successfully connected to: ${nsEndpoint}`);
  });

  // Handle connection errors
  activeNamespaceSocket.on("connect_error", (error) => {
    console.error(`❌ Failed to connect to ${nsEndpoint}:`, error);
    activeNamespaceSocket = null;
    activeNamespaceEndpoint = null;
  });

  // Check if the namespace has changed
  activeNamespaceSocket.on("roomListUpdate", (updatedRooms) => {
    updateRoomsUI(updatedRooms);
  });

  // Update UI with rooms
  updateRoomsUI(clickedNs.rooms);

  // Persist the current namespace selection
  localStorage.setItem("lastNamespace", JSON.stringify(clickedNs));
};

// Helper function to update rooms UI
const updateRoomsUI = (rooms) => {
  const roomList = document.querySelector(".room-list");
  if (!roomList) {
    console.warn("Room list element not found");
    return;
  }
  roomList.innerHTML = rooms
    .map(
      (room) =>
        `<li 
      class="room-item" 
      data-room-id="${room.roomId}" 
      data-namespace-id="${room.namespaceId}" 
      data-room-title="${room.roomTitle}" 
      data-room-private="${room.privateRoom}">
        <span class="fa-solid fa-${room.privateRoom ? "lock" : "globe"}"></span>
        ${room.roomTitle}
      </li>`
    )
    .join("");
  const roomItems = document.querySelectorAll(".room-item");
  console.log(roomItems);
  roomItems.forEach((roomItem) => {
    roomItem.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(e.target);
      const roomId = roomItem.getAttribute("data-room-id");
      const namespaceId = roomItem.getAttribute("data-namespace-id");
      const roomTitle = roomItem.getAttribute("data-room-title");
      // const roomPrivate = roomItem.getAttribute("data-room-private");
      // console.log(roomId, namespaceId, roomTitle, roomPrivate);
      joinRoom(roomId, namespaceId, roomTitle, activeNamespaceSocket);
    });
  });
};
