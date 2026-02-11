// Load saved apps when page loads
window.onload = function () {
  const savedApps = JSON.parse(localStorage.getItem("apps")) || [];
  savedApps.forEach(app => displayApp(app));
};

function addApp() {
  const name = document.getElementById("appName").value;
  const desc = document.getElementById("appDesc").value;
  const link = document.getElementById("appLink").value;

  if (!name || !desc || !link) {
    alert("Please fill all fields");
    return;
  }

  const newApp = { name, desc, link };

  // Save to local storage
  const savedApps = JSON.parse(localStorage.getItem("apps")) || [];
  savedApps.push(newApp);
  localStorage.setItem("apps", JSON.stringify(savedApps));

  displayApp(newApp);

  document.getElementById("appName").value = "";
  document.getElementById("appDesc").value = "";
  document.getElementById("appLink").value = "";
}

function displayApp(app) {
  const appDiv = document.createElement("div");
  appDiv.className = "app-card";
  appDiv.innerHTML = `
    <h2>${app.name}</h2>
    <p>${app.desc}</p>
    <a href="${app.link}" target="_blank">
      <button>Install</button>
    </a>
  `;
  document.body.appendChild(appDiv);
}
