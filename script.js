import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_STORAGE_BUCKET",
appId: "YOUR_APP_ID"
};

const ADMIN_EMAIL = "yourgmail@gmail.com";

/* ================= INITIALIZE ================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

/* ================= LOGIN SYSTEM ================= */

loginBtn.onclick = () => signInWithPopup(auth, provider);
logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, user => {
if(user){
currentUser = user;
welcome.innerText = "Welcome " + user.displayName;
loginBtn.style.display = "none";
logoutBtn.style.display = "inline-block";
}else{
currentUser = null;
welcome.innerText = "";
loginBtn.style.display = "inline-block";
logoutBtn.style.display = "none";
}
loadApps();
});

/* ================= UPLOAD ================= */

uploadBtn.onclick = async () => {

if(!currentUser) return alert("Login first");

const file = appFile.files[0];
if(!file) return alert("Select file");

const storageRef = ref(storage,"apps/" + file.name);
await uploadBytes(storageRef,file);
const url = await getDownloadURL(storageRef);

await addDoc(collection(db,"apps"),{
name: appName.value,
description: appDesc.value,
category: appCategory.value,
fileURL: url,
developerEmail: currentUser.email,
downloads: 0,
boosted: false,
boostExpiry: null
});

alert("Uploaded Successfully");
loadApps();
};

/* ================= LOAD APPS ================= */

async function loadApps(){

approvedApps.innerHTML = "";
myApps.innerHTML = "";

const snapshot = await getDocs(collection(db,"apps"));

let totalDownloadsCount = 0;
let totalBoostedCount = 0;
let apps = [];

snapshot.forEach(docSnap=>{
let d = docSnap.data();
d.id = docSnap.id;
apps.push(d);
});

apps.forEach(app=>{

// Auto Expire Boost
if(app.boostExpiry){
let expiry = new Date(app.boostExpiry);
if(expiry < new Date()){
app.boosted = false;
}
}

totalDownloadsCount += app.downloads || 0;
if(app.boosted) totalBoostedCount++;

});

totalApps.innerText = apps.length;
totalDownloads.innerText = totalDownloadsCount;
totalBoosted.innerText = totalBoostedCount;

if(currentUser && currentUser.email === ADMIN_EMAIL){
adminSection.style.display = "block";
}

let searchText = searchInput.value.toLowerCase();

apps
.filter(a => a.name.toLowerCase().includes(searchText))
.forEach(app=>{

approvedApps.innerHTML += `
<div class="card">
${app.boosted ? '<div class="boost-badge">🔥 BOOSTED</div>' : ''}
<h4>${app.name}</h4>
<p>${app.category}</p>
<p>📥 ${app.downloads}</p>
<a href="${app.fileURL}" target="_blank">Download</a><br>
<button onclick="boostApp('${app.id}')">🚀 Boost</button>
${currentUser && currentUser.email === ADMIN_EMAIL ?
`<button onclick="deleteApp('${app.id}')">Delete</button>` : ""}
</div>
`;

});

if(currentUser){
apps
.filter(a=>a.developerEmail === currentUser.email)
.forEach(app=>{
myApps.innerHTML += `
<div class="card">
${app.boosted ? '<div class="boost-badge">🔥 BOOSTED</div>' : ''}
<h4>${app.name}</h4>
<p>📥 ${app.downloads}</p>
<button onclick="deleteApp('${app.id}')">Delete</button>
</div>
`;
});
}

}

/* ================= BOOST SYSTEM (FREE 30 DAYS) ================= */

window.boostApp = async (id) => {

if(!currentUser){
alert("Login first");
return;
}

const refDoc = doc(db,"apps",id);
const snap = await getDoc(refDoc);
let data = snap.data();

if(data.boostExpiry && new Date(data.boostExpiry) > new Date()){
alert("Already Boosted 🚀");
return;
}

let expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 30);

await updateDoc(refDoc,{
boosted: true,
boostExpiry: expiryDate.toISOString()
});

alert("🔥 Boost Activated for 30 Days");
loadApps();
};

/* ================= DELETE ================= */

window.deleteApp = async (id) => {
await deleteDoc(doc(db,"apps",id));
alert("Deleted");
loadApps();
};

/* ================= SEARCH SYSTEM ================= */

window.searchApps = function(){
loadApps();
};

window.clearSearch = function(){
searchInput.value = "";
loadApps();
};

searchInput.addEventListener("keypress", function(e){
if(e.key === "Enter"){
loadApps();
}
});

/* ================= VOICE SEARCH ================= */

window.startVoice = ()=>{
const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.start();
recognition.onresult = (e)=>{
searchInput.value = e.results[0][0].transcript;
loadApps();
};
};
