require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.error = require("../player/error");

global.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
  // autoRegisterExtractor: false
});
// await player.extractors.loadDefault();
require("../player/playerEvents");
require("./cmdhandler");

client.login(process.env.TOKEN).then(() => {
  require("../keep_alive");
  console.log("Using ", process.env.DP_FORCE_YTDL_MOD);
  console.log("Running on ", process.env.ENV);
});
