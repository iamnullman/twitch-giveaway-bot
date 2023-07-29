# Twitch Giveaway Bot

This is a simple Twitch bot that can run giveaways in your Twitch channel. The bot responds to "hi" or "hello" messages with a friendly greeting. It allows you to start and finish giveaways with specified duration and number of winners. The bot will randomly select winners from the participants.

## Requirements

- Node.js (https://nodejs.org)
- Twitch account for your bot
- OAuth token for your bot account (Get it from https://twitchapps.com/tmi/)

## Installation

1. Clone this repository to your local machine.

2. Install the required dependencies by running the following command in the project directory:

```bash
npm install
```

## Configuration

1. Open the `index.js` file.

2. Update the configuration options in the `opts` object:

   - `identity.username`: Replace this with your bot's Twitch username.
   - `identity.password`: Replace this with your bot's OAuth token obtained from https://twitchapps.com/tmi/.
   - `channels`: Add the names of the channels where you want your bot to operate.

## Usage

To start the bot, run the following command in the project directory:

```bash
node index.js
```

The bot will connect to Twitch and join the specified channels. It will respond to "hi" or "hello" messages with "Hey there!".

### Giveaway Commands

- To start a giveaway, type `!giveaway start <duration> <number_of_winners>` in the chat.
  - Example: `!giveaway start 1h 1` (Starts a 1-hour giveaway with 1 winner)

- To finish an ongoing giveaway (can only be done by the channel owner or a moderator), type `!giveaway finish` in the chat.

**Note**: Make sure your bot account has the necessary permissions (e.g., moderator) in the channels where you want it to run giveaways.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.