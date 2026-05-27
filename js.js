import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL);

// STEP 1: redirect login Discord
app.get("/login", (req,res)=>{
const url =
`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&scope=identify`;

res.redirect(url);
});

// STEP 2: callback
app.get("/callback", async (req,res)=>{

const code = req.query.code;

// exchange code → token
const tokenRes = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
client_id: process.env.DISCORD_CLIENT_ID,
client_secret: process.env.DISCORD_CLIENT_SECRET,
grant_type: "authorization_code",
code: code,
redirect_uri: process.env.DISCORD_REDIRECT_URI
}), {
headers: {
"Content-Type": "application/x-www-form-urlencoded"
}
});

const access_token = tokenRes.data.access_token;

// get user
const userRes = await axios.get("https://discord.com/api/users/@me", {
headers: {
Authorization: `Bearer ${access_token}`
}
});

// save DB
let user = await User.findOne({ discordId: userRes.data.id });

if(!user){
user = await User.create({
discordId: userRes.data.id,
username: userRes.data.username,
avatar: userRes.data.avatar
});
}

res.send(`
<h1>Bienvenue ${user.username}</h1>
<img src="https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png" width="120">
`);
});

app.listen(3000, ()=>console.log("Server ON"));