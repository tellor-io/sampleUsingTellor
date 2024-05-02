//require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

module.exports = {
  //defaultNetwork: "polygon_amoy",
  networks: {
    polygon_amoy: {
      url: process.env.NODE_URL,
      seeds: [process.env.PRIVATE_KEY],
      gas: 8000000 ,
      gasPrice: 10000000000
    },
  },
  etherscan: {
    apiKey: {
      polygon_amoy: process.env.VERIFICATION_KEY
    }
  }
};
