const { QueryType } = require("discord-player");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const MAX_NUMBER_OF_CHOICES = 10;

module.exports = {
  name: "play",
  description: "Play a song of your choice!",
  voiceChannel: true,
  options: [
    {
      name: "song",
      description: "name of song to play",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],

  async autocomplete({ interaction }) {
    const query = interaction.options.getString("song", true);
    const results = await player.search(query);

    return interaction.respond(
      results.tracks.slice(0, MAX_NUMBER_OF_CHOICES).map((t) => ({
        name: `(${t.duration}) - ${t.title}`.slice(0, 100),
        value: t.url,
      }))
    );
  },

  async execute({ interaction }) {
    await interaction.deferReply();

    const songName = interaction.options.getString("song");

    const result = await player
      .search(songName, {
        requestedBy: interaction.member,
        searchEngine: QueryType.AUTO,
      })
      .catch((error) => console.log(error));

    if (!result || !result.tracks.length)
      return client.error.NO_RESULTS_FOUND(interaction);

    const queue = await player.nodes.create(interaction.guild, {
      metadata: {
        channel: interaction.channel,
        client: interaction.guild.members.me,
        requestedBy: interaction.user,
      },
      selfDeaf: true,
      volume: 75,
      leaveOnEnd: true,
      leaveOnEndCooldown: 300000,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 300000,
    });

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      player.deleteQueue(interaction.guildId);
      return client.error.CONNECTION_FAIL(interaction);
    }

    await interaction
      .followUp({
        content: `⏱| Loading your ${result.playlist ? "playlist" : "track"}`,
        ephemeral: true,
      })
      .then(async (message) => {
        queue.addTrack(result.playlist ? result.tracks : result.tracks[0]);
        if (!queue.node.isPlaying()) await queue.node.play();
        message.delete();
      });

    if (result.playlist) {
      const embed = new EmbedBuilder()
        .setURL(result._data.playlist.url)
        .setTitle(result._data.playlist.title)
        .setThumbnail(
          result._data.playlist.thumbnail.url ?? result._data.playlist.thumbnail
        )
        .addFields({
          name: "New Playlist Added! ✅",
          value: `${result._data.tracks.length} song(s) have been added to queue`,
        })
        .setColor("#e6cc00");

      queue.metadata.channel.send({ embeds: [embed] });
    }
  },
};
