const BoldToken = artifacts.require("BoldToken");
const BoldTokenCrowdsale = artifacts.require("BoldTokenCrowdsale");
const BoldKycContract = artifacts.require("./KycContract.sol");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("BoldToken Test", async accounts => {
    const [ deployerAccount, recipientAccount ] = accounts;

    it("Total token supply should begin as zero, and minterRole should be renounced from deployerAccount and assigned to tokenSale address", async () => {
        let tokenInstance = await BoldToken.deployed();
        let tokenSaleInstance = await BoldTokenCrowdsale.deployed();
        expect(tokenInstance.totalSupply()).to.eventually.be.a.bignumber.equal(new BN(0));
        expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
        expect(tokenInstance.isMinter(deployerAccount)).to.eventually.be.false;
        expect(tokenInstance.isMinter(tokenSaleInstance.address)).to.eventually.be.true;
        return expect(tokenInstance.balanceOf(tokenSaleInstance.address)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("Should be possible to buy one token by simply sending ether to the tokenSale, which will mint one token (transaction is accepted)", async () => {
        let tokenInstance = await BoldToken.deployed();
        let tokenSaleInstance = await BoldTokenCrowdsale.deployed();
        let tokenKycInstance = await BoldKycContract.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipientAccount);
        expect(tokenKycInstance.setKycCompleted(recipientAccount, {from: deployerAccount})).to.be.fulfilled;
        expect(tokenSaleInstance.sendTransaction({from: recipientAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(balanceBeforeAccount.add(new BN(1))).to.be.bignumber.equal(await tokenInstance.balanceOf(recipientAccount));
     });

});