// DO NOT EDIT WHEN YOU ADD A NEW COIN
const translator = require("../ninja.translator.js");

module.exports = class Coin {
  constructor(name, donate) {
    this.name = name;
    this.donate = donate;
  }

  templateArtisticHtml(i) {
    const keyelement = "btcprivwif";
    const coinImgUrl = this.getCoinImageUrl();
    const walletBackgroundUrl = this.getWalletBackgroundUrl();

    const walletHtml = `
      <div class='coinIcoin'>
        <img id='coinImg' src='${coinImgUrl}' alt='currency_logo' />
      </div>
      <div class='artwallet' id='artwallet${i}'>
        <img id='papersvg${i}' class='papersvg' src='${walletBackgroundUrl}' />
        <div id='qrcode_public${i}' class='qrcode_public'></div>
        <div id='qrcode_private${i}' class='qrcode_private'></div>
        <div class='btcaddress' id='btcaddress${i}'></div>
        <div class='${keyelement}' id='${keyelement}${i}'></div>
        <div class='paperWalletText'>
          <img class='backLogo' src='${coinImgUrl}' alt='currency_logo' />
          ${translator.get("paperwalletback")}
        </div>
      </div>
    `;
    return walletHtml;
  }

  getWalletBackgroundUrl() {
    return "wallets/" + this.name.toLowerCase() + ".png";
  }
  getCoinImageUrl() {
    return "logos/" + this.name.toLowerCase() + ".png";
  }
};