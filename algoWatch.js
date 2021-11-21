const axios = require('axios');
const emailService = require('./emailService');
const utils = require('./utils');

const assetIds = {
  yldy: 226701642,
  algo: 0,
  usdc: 31566704,
};
let stop = false;

function getPrice() {
  if (!stop) {
    axios
      .get('https://mainnet.analytics.tinyman.org/api/v1/current-asset-prices/')
      .then(({ data }) => {
        const algoPrice = data[assetIds.algo].price;
        const yldyPrice = data[assetIds.yldy].price;
        console.log(
          `Attempt #${utils.counter} - ${utils.time()} ${utils.spacer}`
        );
        console.log(`Current ALGO price: ${algoPrice}`);
        console.log(`Current YLDY price: ${yldyPrice} ${utils.spacer}\n`);
        if (algoPrice < 1.75) {
          emailService.sendEmail(
            getEmailArgs(algoPrice, 'Algorand', {
              assetIn: assetIds.usdc,
              assetOut: assetIds.algo,
            })
          );
          stop = true;
        }
        if (yldyPrice < 0.017 || yldyPrice > 0.0195) {
          emailService.sendEmail(
            getEmailArgs(yldyPrice, 'Yieldly', {
              assetIn: assetIds.algo,
              assetOut: assetIds.yldy,
            })
          );
          stop = true;
        }
        utils.counter++;
      });
  }
}

function getEmailArgs(price, asset, { assetIn, assetOut }) {
  console.log(`🤑 ${asset} Price Alert! 🤑\nCurrent ${asset} price is $${price}. 🤯\n\nSwap as soon as you can bro! 🤗\n
  https://app.tinyman.org/#/swap?asset_in=${assetIn}&asset_out=${assetOut}
`);
  return {
    subject: `🤑 ${asset} Price Alert! 🤑`,
    text: `Current ${asset} price is $${price}. 🤯\n\nSwap as soon as you can bro! 🤗\n
    https://app.tinyman.org/#/swap?asset_in=${assetIn}&asset_out=${assetOut}
  `,
  };
}

setInterval(() => {
  getPrice();
}, 120000);
