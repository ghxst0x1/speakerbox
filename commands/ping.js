module.exports = {
  name: "ping",
  description: "Pings the bot",
  voiceChannel: true,

  async execute({ interaction }) {
    await interaction.deferReply();

    const queue = player.nodes.get(interaction.guildId);
    // if (!queue || !queue.node.isPlaying())
    //   return client.error.DEFAULT_ERROR(interaction);

    await interaction.followUp({
      embeds: [
        {
          title: "⏱️ | Latency",
          fields: [
            {
              name: "Bot Latency",
              value: `\`${Math.round(client.ws.ping)}ms\``,
            },
            //on work
            // {
            //   name: "Voice Latency",
            //   value: !queue
            //     ? "N/A"
            //     : `UDP: \`${
            //         queue.connection.voiceConnection.ping.udp ?? "N/A"
            //       }\`ms\nWebSocket: \`${
            //         queue.connection.voiceConnection.ping.ws ?? "N/A"
            //       }\`ms`,
            // },
          ],
          color: 0xffffff,
        },
      ],
    });
  },
};
