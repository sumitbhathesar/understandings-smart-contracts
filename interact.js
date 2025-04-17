const Web3 = require("web3").default; // 👈 add `.default`
const fs = require("fs");

// Load the contract ABI
const contractJson = JSON.parse(fs.readFileSync("./build/contracts/SimpleStorage.json"));
const ABI = contractJson.abi;
const contractAddress = "0x31775f4c20B9225fa9c1296955ccC268020a4445";

const web3 = new Web3("http://127.0.0.1:7545");

const contract = new web3.eth.Contract(ABI, contractAddress);

async function interact() {
  const accounts = await web3.eth.getAccounts();

  console.log("Using account:", accounts[0]);

  await contract.methods.set(42).send({ from: accounts[0] });
  console.log("Stored 42 in the contract.");

  const result = await contract.methods.get().call();
  console.log("Retrieved value from contract:", result);
}

interact();
