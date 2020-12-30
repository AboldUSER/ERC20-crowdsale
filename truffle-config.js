const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0;
require("dotenv").config({path: "./.env"});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
      host: "127.0.0.1",
      network_id: 5777
    },
    ganache_local: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", AccountIndex)
      },
      network_id: 5777
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/b757792a83444e41baeafd8460aa1d5d", AccountIndex)
      },
      network_id: 5
    },
    ropsten_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/b757792a83444e41baeafd8460aa1d5d", AccountIndex)
      },
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "^0.7.4"
    }
  }
};
