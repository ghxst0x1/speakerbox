const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  description: "Set volume to specific value",
  voiceChannel: true,
  options: [
    {
      name: "amount",
      type: ApplicationCommandOptionType.Number,
      description: `Volume amount to set(0-100)`,
      required: false,
      minValue: 0,
      maxValue: 100,
    },
  ],

  async execute({ interaction }) {
    await interaction.deferReply();

    const queue = player.nodes.get(interaction.guildId);
    if (!queue) return client.error.DEFAULT_ERROR(interaction);

    const volume = parseInt(interaction.options.getNumber("amount"));

    if (isNaN(volume))
      return interaction.followUp({
        content: `🎧 Current volume is **${queue.node.volume}**%`,
        ephemeral: true,
      });

    const success = queue.node.setVolume(volume);
    return interaction.followUp({
      content: success
        ? `Music volume set to **${queue.node.volume}**%! ✅`
        : `Something went wrong ${interaction.member}... try again ? ❌`,
    });
  },
};
