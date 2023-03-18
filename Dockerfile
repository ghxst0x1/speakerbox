#FROM node:18-alpine
FROM node:19.7.0-bullseye-slim

# Create the bot's directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

COPY . /usr/src/bot

# Start the bot.
CMD ["node", "src/bot.js"]
