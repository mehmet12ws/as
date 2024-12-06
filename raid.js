import { Client, GatewayIntentBits, Partials, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import express from 'express';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const userMessageTimes = {};
const messagesToDelete = {};
const timeoutDuration = 10 * 1000; 
const messageLimit = 5; 
const timeWindow = 10 * 1000; 

const imageUrl = "https://cdn.discordapp.com/attachments/1095467401719582750/1314688814073122816/that_one_mehmet_edit.mp4?ex=6754aedf&is=67535d5f&hm=86a4a6e8ce611beb80969ea697a490ceb2e3dabfd1f58ec78afed5523e75bb35&";
const urlToCheck = "https://cdn.discordapp.com/attachments/1196885529845829674/1311408173176979539/image.png?ex=6748bf89&is=67476e09&hm=0a578acfbb5038b731ca47cbdc49b24629e29813a89112d9e1d684f2985d547d&";
const mehmet12ws = "carman";
const mehmet = "sa";
const mehmet1 = "selam";

client.on("ready", () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
    client.user.setActivity('marsı yedim egepoyo carmanda aldım altıma ohh');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const words = message.content.split(/\s+/);

    if (words.includes("sa")) {
        await message.reply("aleyküm selam kardeşim");
    }

    if (words.includes("selam")) {
        await message.reply("aleyküm selam kardeşim");
    }

    if (message.content.includes(urlToCheck)) {
        await message.reply("Komik mi yarram");
    }

    if (message.content.includes(mehmet12ws)) {
        await message.reply("carman delinin biri");
    }

    const userId = message.author.id;
    const currentTime = Date.now();

    if (userMessageTimes[userId]) {
        let timestamps = userMessageTimes[userId];
        timestamps = timestamps.filter((timestamp) => currentTime - timestamp < timeWindow);
        timestamps.push(currentTime);

        if (timestamps.length >= messageLimit) {
            try {
                const guildMember = await message.guild.members.fetch(userId);
                await guildMember.timeout(timeoutDuration, "mehmet12ws anti-raid aktif.");

                if (messagesToDelete[userId]) {
                    for (const msg of messagesToDelete[userId]) {
                        try {
                            await msg.delete();
                        } catch (error) {
                            console.error(`Hata: ${msg.id}`);
                        }
                    }
                }

                const embed = new EmbedBuilder().setImage(imageUrl);
                await message.channel.send({
                    content: `${message.author}`,
                    embeds: [embed],
                });

                await message.channel.send("Flood yapmayalım lütfen.");

                messagesToDelete[userId] = [];
            } catch (error) {
                console.error(`Bot yetki hatası: ${message.author.tag}`);
            }
        }

        if (!messagesToDelete[userId]) {
            messagesToDelete[userId] = [];
        }

        if (messagesToDelete[userId].length >= messageLimit) {
            messagesToDelete[userId].shift();
        }

        messagesToDelete[userId].push(message);

        userMessageTimes[userId] = timestamps;
    } else {
        userMessageTimes[userId] = [currentTime];
        messagesToDelete[userId] = [message];
    }
});


const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Sunucu ${port} numaralı bağlantı noktasında çalışıyor.`);
});

client.login(process.env.TOKEN);
