const url =
  'https://mainnet.analytics.tinyman.org/api/v1/current-asset-prices/';
const axios = require('axios');
const nodemailer = require('nodemailer');
const to =
  'fml1041@gmail.com, hilbertwilliam@gmail.com, tylerlangties@gmail.com, danieljconnor@gmail.com, bkorosu@gmail.com';
function getPrice() {
  axios.get(url).then(({ data }) => {
    const algoPrice = data[0].price;
    const yldyPrice = data['226701642'].price;
    if (algoPrice < 1.77) {
      sendEmail(algoPrice, 'Algorand');
    }
    if (yldyPrice < 0.017) {
      sendEmail(yldyPrice, 'Yieldly');
    }
  });
}

function sendEmail(price, asset) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tinymailer420@gmail.com',
      pass: 'tinymailer!1',
    },
  });

  const mailOptions = {
    from: 'tinymailer420@gmail.com',
    to: 'fml1041@gmail.com, hilbertwilliam@gmail.com',
    subject: `🤑 ${asset} Price Alert! 🤑`,
    text: `Current ${asset} price is $${price}. 🤯\n\nSwap USDC for ${asset} as soon as you can bro! 🤗\n
    https://app.tinyman.org/#/swap?asset_in=31566704&asset_out=0
    `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent:' + info.response);
    }
  });
}

//work out somethin to not spam the emails

setInterval(() => {
  getPrice();
}, 120000);
