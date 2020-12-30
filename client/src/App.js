import React, { Component } from "react";
import BoldTokenContract from "./contracts/BoldToken.json";
import BoldTokenCrowdsaleContract from "./contracts/BoldTokenCrowdsale.json";
import KycContract from "./contracts/KycContract.json"
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "0xYourAddress", tokenSaleAddress: null, userTokens: 0, availableTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();

      this.boldTokenInstance = new this.web3.eth.Contract(
        BoldTokenContract.abi,
        BoldTokenContract.networks[networkId] && BoldTokenContract.networks[networkId].address
      );

      this.boldTokenCrowdsaleInstance = new this.web3.eth.Contract(
        BoldTokenCrowdsaleContract.abi,
        BoldTokenCrowdsaleContract.networks[networkId] && BoldTokenCrowdsaleContract.networks[networkId].address
      );

      this.KycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[networkId] && KycContract.networks[networkId].address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenTokenTransfer();
      this.setState( {loaded: true, tokenSaleAddress: BoldTokenCrowdsaleContract.networks[networkId].address}, this.updateUserAndAvailableTokens );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Welcome to the Bold Token Crowdsale!</h1>
        <p>Get your social tokens now!</p>
        <h2>KYC Whitelisting</h2>
        <p>Your address is {this.web3.currentProvider.selectedAddress}</p>
        Address: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleKycButtonClick}>Submit for KYC</button>
        <h2>Token Purchase</h2>
        <p>Number of tokens available for purchase: {this.state.availableTokens}</p>
        <p>If you want to buy tokens then send Wei to this address: {this.state.tokenSaleAddress}</p>
        <p>Number of tokens already in your account: {this.state.userTokens} </p>
        <button type="button" onClick={this.handleBuyTokenButtonClick}>Buy more BOLD tokens</button>
      </div>
    );
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
  });
  console.log(this.state.kycAddress);
  }

  handleKycButtonClick = async () => {
    await this.KycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    alert("The following address has been whitelisted: " + this.state.kycAddress)
  }

  handleBuyTokenButtonClick = async () => {
    console.log("starting");
    await this.boldTokenCrowdsaleInstance.methods.buyTokens(this.accounts[0]).send({from:this.accounts[0], value: this.web3.utils.toWei("1","wei")});
    console.log("ending");
  }

  updateUserAndAvailableTokens = async () => {
    let availableTokens = await this.boldTokenInstance.methods.balanceOf(this.state.tokenSaleAddress).call();
    let userTokens = await this.boldTokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({availableTokens: availableTokens, userTokens: userTokens});
  }

  listenTokenTransfer = ()=> {
    this.boldTokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserAndAvailableTokens)
      }

}

export default App;
