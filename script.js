function addApp() {
  const name = document.getElementById("appName").value;
  const desc = document.getElementById("appDesc").value;
  const link = document.getElementById("appLink").value;

  if (!name || !desc || !link) {
    alert("Please fill all fields");
    return;
  }

  const appDiv = document.createElement("div");
  appDiv.className = "app-card";
  appDiv.innerHTML = `
    <h2>${name}</h2>
    <p>${desc}</p>
    <a href="${link}" target="_blank">
      <button>Install</button>
    </a>
  `;

  document.body.appendChild(appDiv);

  document.getElementById("appName").value = "";
  document.getElementById("appDesc").value = "";
  document.getElementById("appLink").value = "";
}
