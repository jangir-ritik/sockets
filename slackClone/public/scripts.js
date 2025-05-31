// const username = prompt("What is your username?");
// const password = prompt("What is your password?");
// temp remove the prompts to save dev headaches
const username = "Ritik";
const password = "x";

const socket = io("http://localhost:9000");

socket.on("connect", () => {
  console.log("connected");
  socket.emit("clientConnect");
});

// Listen for the nslist event from the server which gives us the namespaces
socket.on("nsList", (nsData) => {
  if (!nsData || nsData.length === 0) return;

  const lastNamespace = getLastNamespace(nsData);
  renderNamespaces(nsData, lastNamespace);
  autoJoinNamespace(nsData, lastNamespace);
});

function getLastNamespace(nsData) {
  try {
    const stored = JSON.parse(localStorage.getItem("lastNamespace"));
    // Verify the stored namespace still exists in current data
    return stored && nsData.find((ns) => ns.name === stored.name)
      ? stored
      : nsData[0];
  } catch (error) {
    console.warn("Error parsing lastNamespace from localStorage:", error);
    return nsData[0];
  }
}

function renderNamespaces(nsData, lastNamespace) {
  const namespacesDiv = document.querySelector(".namespaces");
  if (!namespacesDiv) return;

  // Clear any existing event listeners to prevent duplicates
  const newNamespacesDiv = namespacesDiv.cloneNode(false);
  namespacesDiv.parentNode.replaceChild(newNamespacesDiv, namespacesDiv);

  newNamespacesDiv.innerHTML = nsData
    .map(
      (ns) =>
        `<div class="namespace ${
          ns.name === lastNamespace.name ? "activeNamespace" : ""
        }" 
           ns="${ns.endpoint}"
           data-name="${ns.name}">
        <img src="${ns.image}" alt="${ns.name}">
      </div>`
    )
    .join("");

  // Use event delegation
  newNamespacesDiv.addEventListener("click", (e) => {
    const namespaceEl = e.target.closest(".namespace");
    if (namespaceEl) {
      // Remove active class from all namespaces
      document.querySelectorAll(".namespace").forEach((el) => {
        el.classList.remove("activeNamespace");
      });

      // Add active class to clicked namespace
      namespaceEl.classList.add("activeNamespace");

      joinNs(namespaceEl, nsData);
    }
  });
}

function autoJoinNamespace(nsData, lastNamespace) {
  // Use data-name to find the element since we're setting it
  const targetElement = document.querySelector(
    `.namespace[data-name="${lastNamespace.name}"]`
  );

  if (targetElement) {
    // Ensure the target element has the active class
    document.querySelectorAll(".namespace").forEach((el) => {
      el.classList.remove("activeNamespace");
    });
    targetElement.classList.add("activeNamespace");

    joinNs(targetElement, nsData);
  } else {
    // Fallback to first namespace
    const firstNamespace = document.querySelector(".namespace");
    if (firstNamespace) {
      firstNamespace.classList.add("activeNamespace");
      joinNs(firstNamespace, nsData);
    }
  }
}