const axios = require('axios');
const emailService = require('./emailService');
const to =
  'fml1041@gmail.com, hilbertwilliam@gmail.com, tylerlangties@gmail.com';
let stop = false;
function getPrice() {
  console.log(`Emails halted: ${stop}`);
  if (!stop) {
    axios
      .get('https://mainnet.analytics.tinyman.org/api/v1/current-asset-prices/')
      .then(({ data }) => {
        const algoPrice = data[0].price;
        const yldyPrice = data['226701642'].price;
        console.log(`Current ALGO price: ${algoPrice}`);
        console.log(`Current YLDY price: ${yldyPrice}`);
        if (algoPrice < 1.75) {
          emailService.sendEmail(getEmailArgs(algoPrice, 'Algorand'));
          console.log('Algorand alert!');
          stop = true;
        }
        if (yldyPrice < 0.016) {
          emailService.sendEmail(getEmailArgs(yldyPrice, 'Yieldly'));
          console.log('Yieldly alert!');
          stop = true;
        }
      });
  }
}

function getEmailArgs(price, asset) {
  return {
    subject: `🤑 ${asset} Price Alert! 🤑`,
    text: `Current ${asset} price is $${price}. 🤯\n\nSwap USDC for ${asset} as soon as you can bro! 🤗\n
  https://app.tinyman.org/#/swap?asset_in=31566704&asset_out=0
  `,
    to,
  };
}

setInterval(() => {
  getPrice();
}, 120000);
