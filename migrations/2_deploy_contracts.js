var BoldToken = artifacts.require("./BoldToken.sol");
var BoldTokenCrowdsale = artifacts.require("./BoldTokenCrowdsale.sol");
var BoldKycContract = artifacts.require("./KycContract.sol");
// require("dotenv").config({path: "../.env"});

module.exports = async (deployer) => {

    let addr = await web3.eth.getAccounts();

    await deployer.deploy(BoldToken, 0);
    await deployer.deploy(BoldKycContract);
    await deployer.deploy(BoldTokenCrowdsale, 1, addr[0], BoldToken.address, BoldKycContract.address);
    
    let instance = await BoldToken.deployed();
    await instance.addMinter(BoldTokenCrowdsale.address);
    await instance.renounceMinter();

}