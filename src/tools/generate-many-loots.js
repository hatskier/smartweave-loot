const Arweave = require('arweave');
const { SmartWeaveNodeFactory, LoggerFactory } = require("redstone-smartweave");
const wallet = require("../../.secrets/jwk.json");
const { loot: lootContractAddress } = require("../deployed-contracts.json");

const TX_COUNT = 1000;

(async () => {
  // Set up Arweave client
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });

  // Set up SmartWeave client
  LoggerFactory.INST.logLevel('silly');
  const smartweave = SmartWeaveNodeFactory.memCached(arweave);

  // Interacting with the contract
  const contract = smartweave
    .contract(lootContractAddress)
    .connect(wallet)
    .setEvaluationOptions({
      waitForConfirmation: false,
    });

  // Generating a loot
  for (let i = 0; i < TX_COUNT; i++) {
    console.log('Generating a loot: ' + i);
    await contract.writeInteraction({
      function: "generate",
      data: {
        ranomizer: Math.random(),
      }
    });
  }
  
  console.log('Completed');
})();
