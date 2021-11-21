const axios = require('axios');
const emailService = require('./emailService');
const utils = require('./utils');

let previous;

function getLatest() {
  console.log(`Attempt #${utils.counter} - ${utils.time()} ${utils.spacer}`);
  console.log('🚚 Getting latest ASA listings... 🚚');
  axios
    .get('https://api.v3.tinychart.org/assets/')
    .then(({ data }) => {
      const current = data
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 1)[0];
      console.log('🔍 Checking the latest... 🔍');
      if (previous && current.id !== previous.id) {
        console.log(text(current));
        emailService.sendEmail({
          subject: `New ASA on TinyChart 📈 - ${utils.time()}`,
          text: text(current),
        });
      } else {
        console.log(`😩😓 No luck! 😓😩 ${utils.spacer}\n`);
      }
      previous = current;
      utils.counter++;
    })
    .catch((error) => {
      console.error(error);
    });
}

function text(latest) {
  return `💰 New ASA listed on TinyChart! 💰 \n
📋 ${latest.name} - ${latest.ticker} \n
💸 Total transactions: ${latest.transactions} \n
📊 Go directly to Tinyman: https://app.tinyman.org/#/swap?asset_in=0&asset_out=${latest.id} \n
📈 Click to see the TinyChart: https://tinychart.org/asset/${latest.id} \n`;
}

setInterval(() => {
  getLatest();
}, 120000);
