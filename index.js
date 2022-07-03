require('dotenv').config();
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const fetch = require('node-fetch');
const schedule = require('node-schedule');

const sadWordsArr = [
  'sad',
  'depressed',
  'unhappy',
  'angry',
  'give up',
  'upset',
  'traurig',
  'schlecht',
  'weinen',
];
const encouragementsArr = [
  'Cheer up!',
  'You can do it!',
  "I'm proud of you!",
  'You rock!',
  "Don't give up!",
  "Keep going! You're almost there!",
];

function getQuote() {
  return fetch('https://zenquotes.io/api/random')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]['q'] + ' -' + data[0]['a'];
    });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (msg) => {
  if (msg.author.bot) return;

  if (msg.content === '$inspire') {
    getQuote().then((quote) => msg.channel.send(quote));
  }

  if (sadWordsArr.some((word) => msg.content.includes(word))) {
    const encouragement =
      encouragementsArr[Math.floor(Math.random() * encouragementsArr.length)];
    msg.reply(encouragement);
  }
});

const job = schedule.scheduleJob({ hour: 6, minute: 55 }, async function () {
  try {
    const url = `https://tenor.googleapis.com/v2/search?q=programming&key=${process.env.TENOR_KEY}&client_key=my_test_app&limit=200`;
    const res = await fetch(url);
    const data = await res.json();
    let index = Math.floor(Math.random() * data.results.length);
    const channel = client.channels.cache.get('986348839827021837');
    channel.send({ content: data.results[index].url });
    channel.send(`✨ Have a wonderful day dear Students! ✨
      Let me present today's #inspiring quote to you:`);
    getQuote().then((quote) => channel.send(quote));
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);
