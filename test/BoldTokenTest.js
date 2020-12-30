const BoldToken = artifacts.require("BoldToken");
require("dotenv").config({path: "../.env"});

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("BoldToken Test", async accounts => {
    const [ deployerAccount, recipientAccount ] = accounts;
    
    beforeEach(async () => {
        this.bToken = await BoldToken.new(process.env.INITIAL_TOKENS);
    });

    it("Total token supply should be minted into my account", async () => {
        let instance = this.bToken;
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    });
    
    // it("Send amount of token from one account to another account", async () => {
    //     const sentAmount = new BN(1);
    //     let instance = this.bToken;
    //     let totalSupply = await instance.totalSupply();
    //     expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    //     expect(instance.transfer(recipientAccount, sentAmount)).to.eventually.be.fulfilled; // can also used .rejected
    //     expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(sentAmount));
    //     return expect(instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(sentAmount);
    // });

    // it("Send amount of token from one account to another account greater than what exists", async () => {
    //     let instance = this.bToken;
    //     let balanceOfAccount = await instance.balanceOf(deployerAccount);
    //     expect(instance.transfer(recipientAccount, new BN(balanceOfAccount+1))).to.eventually.be.rejected;
    //     //check if the balance is still the same
    //     return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfAccount);            
    // });

});