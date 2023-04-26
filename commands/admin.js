module.exports = {
  name: "admin",
  description: "Prints player dependencies",

  async execute({ interaction }) {
    await interaction.deferReply();

    if (process.env.CREATOR_ID == interaction.user.id) {
      const depens = player.scanDeps();
      await interaction.followUp({
        embeds: [
          {
            title: "📦 | Dependency",
            fields: [
              {
                name: "Player Dependencies",
                value: `${depens}`,
              },
              {
                name: "Environment",
                value: `${process.env.ENV}`,
              },
              {
                name: "Downloader",
                value: `${process.env.DP_FORCE_YTDL_MOD}`,
              },
            ],
            timestamp: new Date().toISOString(),

            color: 0xff0000,
          },
        ],
      });
    } else {
      await interaction.followUp({
        content: `:no_entry_sign: You're not my creator. Go away. :persevere:`,
        ephemeral: true,
      });
    }
  },
};
