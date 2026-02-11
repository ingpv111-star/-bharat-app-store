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

  const newApp = { name, desc, link, downloads: 0 };

  const savedApps = JSON.parse(localStorage.getItem("apps")) || [];
  savedApps.push(newApp);
  localStorage.setItem("apps", JSON.stringify(savedApps));

  displayApp(newApp, savedApps.length - 1);

  document.getElementById("appName").value = "";
  document.getElementById("appDesc").value = "";
  document.getElementById("appLink").value = "";
}

function displayApp(app, index) {
  const appDiv = document.createElement("div");
  appDiv.className = "app-card";

  appDiv.innerHTML = `
    <h2>${app.name}</h2>
    <p>${app.desc}</p>
    <p>Downloads: <span id="count-${index}">${app.downloads}</span></p>
    <a href="${app.link}" target="_blank">
      <button onclick="increaseDownload(${index})">Install</button>
    </a>
  `;

  document.body.appendChild(appDiv);
}

function increaseDownload(index) {
  const savedApps = JSON.parse(localStorage.getItem("apps")) || [];
  savedApps[index].downloads += 1;
  localStorage.setItem("apps", JSON.stringify(savedApps));

  document.getElementById(`count-${index}`).innerText =
    savedApps[index].downloads;
}
