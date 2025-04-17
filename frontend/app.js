let web3;
let contract;
const contractAddress = "0x31775f4c20B9225fa9c1296955ccC268020a4445"; // replace with your deployed address
const contractABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "_value", "type": "uint256"}],
    "name": "set",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAll",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "get",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const connectStatus = document.getElementById("metamaskStatus");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toast-message");
const txList = document.getElementById("tx-list");
let recentTxs = [];

async function connectWallet() {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      connectStatus.innerText = `🟢 Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
      connectStatus.classList.remove("badge-disconnected");
      connectStatus.classList.add("badge-connected");

      contract = new web3.eth.Contract(contractABI, contractAddress);
    } catch (err) {
      console.error("MetaMask connection failed:", err);
      connectStatus.innerText = "🔴 Connection Failed";
    }
  } else {
    alert("Please install MetaMask.");
  }
}

function showToast(message) {
  toastMsg.querySelector('.toast-body').textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

async function setValue() {
  const value = document.getElementById("valueInput").value;
  if (!value || isNaN(value)) {
    showToast("❌ Please enter a valid number.");
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();
    const receipt = await contract.methods.set(value).send({ from: accounts[0] });

    showToast(`✅ Stored ${value} successfully!`);
    recentTxs.unshift(receipt.transactionHash);
    updateTransactionList();
    document.getElementById("valueInput").value = "";
  } catch (err) {
    console.error("Transaction failed:", err);
    showToast("❌ Transaction failed. Check console for error.");
  }
}

async function getAllStoredValues() {
  try {
    const values = await contract.methods.getAll().call();
    const display = document.getElementById("values-display");
    display.innerHTML = values.length
      ? values.map((v) => `<div class="bg-light p-2 mb-1 rounded">${v}</div>`).join("")
      : "<div class='text-muted'>No values stored yet.</div>";
  } catch (err) {
    console.error("Error fetching values:", err);
    showToast("❌ Failed to load values.");
  }
}

function updateTransactionList() {
  txList.innerHTML = recentTxs
    .slice(0, 5)
    .map((tx) => `<li class="list-group-item"><a href="https://sepolia.etherscan.io/tx/${tx}" target="_blank">${tx}</a></li>`)
    .join("");
}

window.addEventListener("DOMContentLoaded", connectWallet);
