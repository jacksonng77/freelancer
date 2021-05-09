import Web3 from "web3";
import freelancerArtifact from "../../build/contracts/freelancer.json";
import 'bootstrap';
import { Modal } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = {

  //web3 declarations
  web3: null,
  account: null,
  meta: null,
  freelancerContractAddress:null,
  freelancerContract:null,

  //ui declarations
  uiSpnLoad:null,
  uiConContract:null,
  uiLblContractAddress:null,
  uiLblFreelancerAddress:null,
  uiTxtContractAddress:null,
  uiLblProjectState:null,
  scheduleModal: null,

  start: async function() {
    const { web3 } = this;
    //get accounts
    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];
  },

  btnGo: function(){
    this.uiTxtContractAddress = document.getElementById("txt-contract-address").value;

    if (this.uiTxtContractAddress === ""){
      this.deployFreelancer();
    }
    else {
      console.log("something");
    }
  },

  btnAddSchedule: function(){
    console.log("OK ADD");
    this.scheduleModal = Modal.getInstance(document.getElementById('scheduleModal'));
    this.scheduleModal.hide();
  },

  utilProjectStatus: function(statusCode){
    this.uiLblProjectState = document.getElementById("lbl-project-status");
    switch(statusCode){
      case 0:
        this.uiLblProjectState.classList.add('bg-primary');
        this.uiLblProjectState.textContent = "Planned";
        break;
      case 1:
        this.uiLblProjectState.classList.add('bg-success');
        this.uiLblProjectState.textContent = "Funded";
        break;
      case 2:
        this.uiLblProjectState.classList.add('bg-warning');
        this.uiLblProjectState.textContent = "Started";
        break;
      case 3:
        this.uiLblProjectState.classList.add('bg-info');
        this.uiLblProjectState.textContent = "Approved";
        break;        
      case 4:
        this.uiLblProjectState.classList.add('bg-light');
        this.uiLblProjectState.textContent = "Released";
        break;  
    }
  },

  deployFreelancer: async function() {
    const { web3 } = this;
    this.freelancerContract = new web3.eth.Contract(freelancerArtifact.abi);
    this.uiSpnLoad = document.getElementById("spn-load");
    this.uiConContract = document.getElementById("con-contract");
    this.uiLblContractAddress = document.getElementById("lbl-contract-address");
    this.uiLblFreelancerAddress = document.getElementById("lbl-freelancer-address");

    this.uiSpnLoad.classList.remove('d-none');
    this.freelancerContract.deploy({
      data: freelancerArtifact.bytecode,
      arguments: []
    }).send({
      from: this.account, 
    }, (error, transactionHash) => {})
    .on('error', (error) => { 
      console.log("error");            
    })
    .on('receipt', (receipt) => {
      console.log("DONE" + receipt.contractAddress); // contains the new contract address
      this.uiSpnLoad.classList.add('d-none');
      this.uiConContract.classList.remove('d-none');

      this.freelanceContractAddress = receipt.contractAddress;
      this.uiLblContractAddress.textContent = receipt.contractAddress;

      this.freelancerContract = new web3.eth.Contract(freelancerArtifact.abi, this.freelanceContractAddress);
      this.freelancerContract.methods.freelancerAddress().call().then((result) =>{
        this.uiLblFreelancerAddress.textContent = result;
      });

      this.freelancerContract.methods.projectState().call().then((result) =>{
        this.utilProjectStatus(0);
      });
    })
  },

  refreshBalance: async function() {
    const { getBalance } = this.meta.methods;
    const balance = await getBalance(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },

  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { sendCoin } = this.meta.methods;
    await sendCoin(receiver, amount).send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});