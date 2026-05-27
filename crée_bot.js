const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const bots = JSON.parse(fs.readFileSync('./bots.json', 'utf8'));

function startBot(config) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  client.on('ready', () => {
    console.log(`🤖 ${config.name} connecté`);
  });

  client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(config.prefix)) return;

    const cmd = message.content.slice(config.prefix.length);

    if (cmd === 'ping' && config.ping) {
      message.reply(`🏓 Pong de ${config.name}`);
    }
  });

  client.login(config.token);
}

// Lancer tous les bots
bots.forEach(startBot);