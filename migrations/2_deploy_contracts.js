var SupplyChainContract = artifacts.require("./SupplyChainContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SupplyChainContract);
};
