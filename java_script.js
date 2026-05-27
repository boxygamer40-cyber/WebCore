// Récupérer token dans l'URL après redirection Discord
const hash = new URLSearchParams(window.location.hash.substring(1));
const token = hash.get("access_token");

if(token){
localStorage.setItem("discord_token", token);
window.location.hash = "";
}

// Charger token stocké
const savedToken = localStorage.getItem("discord_token");

if(savedToken){

fetch("https://discord.com/api/users/@me",{
headers:{
Authorization:"Bearer " + savedToken
}
})
.then(res => res.json())
.then(user => {

document.getElementById("user").innerHTML = `
<h2>Bienvenue ${user.username}</h2>
<img width="120" src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png">
<p>ID: ${user.id}</p>
<br>
<button onclick="logout()">Déconnexion</button>
`;

document.getElementById("login").style.display = "none";

});
}

// Logout
function logout(){
localStorage.removeItem("discord_token");
location.reload();
}