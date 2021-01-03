const BoldToken = artifacts.require("BoldToken");
require("dotenv").config({path: "../.env"});

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("BoldToken Test", async accounts => {
    const [ deployerAccount, recipientAccount ] = accounts;
    
    beforeEach(async () => {
        this.bToken = await BoldToken.new();
    });

    it("Total token supply should not be minted into my account from deployment, and should start as zero", async () => {
        const numberZero = new BN(0);
        let instance = this.bToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.totalSupply()).to.eventually.be.a.bignumber.equal(numberZero);
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    });
    
    it("Mint one token and send from one account to another (transaction is accepted)", async () => {
        const sentAmount = new BN(1);
        let instance = this.bToken;
        let initialSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(initialSupply);
        expect(instance.mint(recipientAccount, sentAmount)).to.eventually.be.fulfilled; // can also used .rejected
        expect(instance.totalSupply()).to.eventually.be.a.bignumber.equal(initialSupply.add(sentAmount));
        let newSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(newSupply.sub(sentAmount));
        return expect(instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(sentAmount);
    });

    it("Mint one token to one account and send amount of token from one account to another account (transaction is accepted)", async () => {
        const mintAmount = new BN(1);
        let instance = this.bToken;
        expect(instance.mint(deployerAccount, mintAmount)).to.eventually.be.fulfilled;
        let balanceOfAccount = await instance.balanceOf(deployerAccount);
        expect(instance.transfer(recipientAccount, new BN(balanceOfAccount), {from: deployerAccount})).to.eventually.be.fulfilled;
        //check if the balance is still different
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(balanceOfAccount-1));            
    });

    it("Mint one token to one account and send amount of token from one account to another account greater than what exists (transaction is rejected)", async () => {
        const mintAmount = new BN(1);
        let instance = this.bToken;
        expect(instance.mint(deployerAccount, mintAmount)).to.eventually.be.fulfilled;
        let balanceOfAccount = await instance.balanceOf(deployerAccount);
        expect(instance.transfer(recipientAccount, new BN(balanceOfAccount+1), {from: deployerAccount})).to.eventually.be.rejected;
        //check if the balance is still the same
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfAccount);            
    });

    it("Mint one token from an account that does not have minter role (transaction is rejected)", async () => {
        const mintAmount = new BN(1);
        let instance = this.bToken;
        let balanceOfAccount = await instance.balanceOf(deployerAccount);
        expect(instance.mint(deployerAccount, mintAmount, {from: recipientAccount})).to.eventually.be.rejected;
        //check if the balance is still the same
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(balanceOfAccount));            
    });
    

});