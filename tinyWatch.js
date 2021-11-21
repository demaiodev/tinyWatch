const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const spacer = '\n---------------------------------------';
const to =
  'fml1041@gmail.com, hilbertwilliam@gmail.com, tylerlangties@gmail.com';
let counter = 1;
let previous = { id: 0 };

function text(latest) {
  return `💰 New ASA listed on TinyChart! 💰 \n
📊 Go directly to Tinyman: https://app.tinyman.org/#/swap?asset_in=0&asset_out=${latest.id} \n
📈 Click to see the TinyChart: https://tinychart.org/asset/${latest.id} \n`;
}

function getLatest() {
  const time = new Date().toLocaleString();
  console.log(`Attempt #${counter} - ${time} ${spacer}`);
  console.log('🚚 Getting latest ASA listings... 🚚');
  axios
    .get('https://api.v3.tinychart.org/assets/')
    .then(({ data }) => {
      const current = data
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 1)[0];
      console.log('🔍 Checking the latest... 🔍');
      if (current.id !== previous.id) {
        console.log(text(current));
        sendEmail(current, time);
      } else {
        console.log(`😩😓 No luck! 😓😩 ${spacer}\n`);
      }
      previous = current;
      counter++;
    })
    .catch((error) => {
      console.error(error);
    });
}

function sendEmail(latest, time) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });
  const mailOptions = {
    from: 'tinymailer420@gmail.com',
    to,
    subject: `New ASA on TinyChart 📈 - ${time}`,
    text: text(latest),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    }
  });
}

setInterval(() => {
  getLatest();
}, 60000);
