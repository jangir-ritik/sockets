const joinNs = (el, nsData) => {
  const nsEndpoint = el.getAttribute("ns");
  console.log(nsEndpoint);

  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);
  if (!clickedNs) {
    console.error("Namespace not found:", nsEndpoint);
    return;
  }

  const rooms = clickedNs.rooms;
  let roomList = document.querySelector(".room-list");

  if (roomList) {
    // Use innerHTML assignment instead of concatenation for better performance
    roomList.innerHTML = rooms
      .map(
        (room) =>
          `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`
      )
      .join("");
  }

  localStorage.setItem("lastNamespace", JSON.stringify(clickedNs));
};
