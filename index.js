const tmi = require('tmi.js');
const ms = require("ms");
const efdb = require("./database");
const db = new efdb({
    databaseName: "db",
    autoFile: true,
    deletingBlankData: true,
    adapter: "JsonDB"
});

const opts = {
    options: { debug: false },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: '',//username
        password: ""//auth token from https://twitchapps.com/tmi/
    },
    channels: [
        //channel names
        "iamnullman"
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

client.connect().catch(console.error);
client.on("connected", (address, port) => {
    console.log(`Bot connected to ${address}:${port}`);
    db.deleteAll();
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;
    if (message.toLowerCase() === "hi" || message.toLowerCase() === "hello") {
        client.say(channel, `Hey there!`);
    }
});

client.on('message', (channel, tags, message, self) => {
    if (self) return;
    if (db.has(`giveaways.${channel.replace("#", "")}`)) {
        const giveaways = db.get(`giveaways.${channel.replace("#", "")}`);
        if (giveaways.users.includes(tags.username)) return;

        db.push(`giveaways.${channel.replace("#", "")}.users`, tags.username);
        console.log(db.get(`giveaways.${channel.replace("#", "")}`));
    }
});

client.on("message", (channel, tags, message, self) => {
    if (self) return;

    const args = message.split(" ");
    if (args[0].toLowerCase() === "!giveaway") {
        if (args[1] == "start" && (tags.username == channel.replace("#", "") || tags.mod)) {
            if (!args[2]) return client.say(channel, "You need to specify the duration of the giveaway. Example: !giveaway start 1h");
            if (!args[3]) return client.say(channel, "You need to specify the number of winners. Example: !giveaway start 1h 1");
            if (ms(args[2]) > ms("1h")) return client.say(channel, "The giveaway duration cannot exceed 1 hour.");
            if (isNaN(args[3])) return client.say(channel, "The number of winners must be a number.");
            if (db.has(`giveaways.${channel}`)) return client.say(channel, "A giveaway is already running on this channel.");
            client.say(channel, `Giveaway started! Number of winners: ${args[3]}`);
            const id = Math.random().toString(36).substring(7);
            db.set(`giveaways.${channel.replace("#", "")}`, {
                channel: channel.replace("#", ""),
                winners: args[3],
                users: []
            });
            setTimeout(() => {
                if (!db.has(`giveaways.${channel.replace("#", "")}`)) return;
                const giveaways = db.get(`giveaways.${channel.replace("#", "")}`);
                const users = giveaways.users;
                const winners = [];
                for (let i = 0; i < giveaways.winners; i++) {
                    const winner = users[Math.floor(Math.random() * users.length)];
                    winners.push(winner);
                    users.splice(users.indexOf(winner), 1);
                }
                client.say(channel, `Giveaway ended! Winners: ${users.join(", ")}`);
                db.delete(`giveaways.${id}`);
            }, ms(args[2]));
        }

        if (args[1] == "finish" && (tags.username == channel.replace("#", "") || tags.mod)) {
            const giveaways = db.get(`giveaways.${channel.replace("#", "")}`);
            if (!db.has(`giveaways.${channel.replace("#", "")}`)) return client.say(channel, "There's no ongoing giveaway on this channel.");
            const users = giveaways.users;
            const winners = [];
            for (let i = 0; i < giveaways.winners; i++) {
                const winner = users[Math.floor(Math.random() * users.length)];
                winners.push(winner);
                users.splice(users.indexOf(winner), 1);
            }
            client.say(channel, `Giveaway ended! Winners: ${winners.join(", ")}`);
            db.delete(`giveaways.${channel.replace("#", "")}`);
        }
    }
});
