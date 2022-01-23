const BrownieToken = artifacts.require("BrownieToken");
const BrownieTokenSale = artifacts.require("BrownieTokenSale");

module.exports = function (deployer) {
  deployer.deploy(BrownieToken).then(() => {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(BrownieTokenSale, BrownieToken.address,tokenPrice);
  }).catch((err) => {
    console.log(err)
  });
};
