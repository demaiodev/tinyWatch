const axios = require('axios');
const emailService = require('./emailService');

const spacer = '\n---------------------------------------';
const to =
  'fml1041@gmail.com, hilbertwilliam@gmail.com, tylerlangties@gmail.com';
let counter = 1;
let previous;

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
      console.log(previous);
      if (previous && current.id !== previous.id) {
        console.log(text(current));
        emailService.sendEmail({
          subject: `New ASA on TinyChart 📈 - ${time}`,
          text: text(current),
          to: 'fml1041@gmail.com',
        });
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

function text(latest) {
  return `💰 New ASA listed on TinyChart! 💰 \n
📊 Go directly to Tinyman: https://app.tinyman.org/#/swap?asset_in=0&asset_out=${latest.id} \n
📈 Click to see the TinyChart: https://tinychart.org/asset/${latest.id} \n`;
}

setInterval(() => {
  getLatest();
}, 120000);

getLatest();
