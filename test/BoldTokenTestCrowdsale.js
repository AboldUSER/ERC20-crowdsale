const BoldToken = artifacts.require("BoldToken");
const BoldTokenCrowdsale = artifacts.require("BoldTokenCrowdsale");
const BoldKycContract = artifacts.require("./KycContract.sol");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("BoldToken Test", async accounts => {
    const [ deployerAccount, recipientAccount ] = accounts;

    it("Total token supply should be automatically sent from my account", async () => {
        let instance = await BoldToken.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("Total token supply should be automatically sent to token crowdsale contract address", async () => {
        let instance = await BoldToken.deployed();
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(BoldTokenCrowdsale.address)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    // If using this test, need to comment out the test below 
    // it("User can send ETH and recieve token from token crowdsale contract", async () => {
    //     let instance = await BoldToken.deployed();
    //     let userPurchaseAmount = 1
    //     await web3.eth.sendTransaction({from: recipientAccount, to: BoldTokenCrowdsale.address, value: userPurchaseAmount, gas: 300000 });
    //     return expect(instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(userPurchaseAmount);
    // });

    it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
        let tokenInstance = await BoldToken.deployed();
        let tokenSaleInstance = await BoldTokenCrowdsale.deployed();
        let tokenKycInstance = await BoldKycContract.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipientAccount);
        expect(tokenKycInstance.setKycCompleted(recipientAccount, {from: deployerAccount})).to.be.fulfilled;
        expect(tokenSaleInstance.sendTransaction({from: recipientAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(balanceBeforeAccount.add(new BN(1))).to.be.bignumber.equal(await tokenInstance.balanceOf(recipientAccount));
     });

});