const KBMarket = artifacts.require("KBMarket");
const NFT = artifacts.require("NFT");
const fs = require('fs');

module.exports = async function (deployer) {
  await deployer.deploy(KBMarket);
  const nftMarketPlace  = await  KBMarket.deployed();

  await deployer.deploy(NFT, nftMarketPlace.address);
  const nft = await NFT.deployed()

  let data = `
    export const NFT_Market_Address = ${nftMarketPlace.address}
    export const NFT_Address = ${nft.address}
  `
  data  = JSON.stringify(data);
  fs.writeFileSync('./client/src/config.js' , JSON.parse(data));
};