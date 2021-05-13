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
  uiSpnAddSchedule: null,
  uiConContract:null,
  uiLblContractAddress:null,
  uiLblFreelancerAddress:null,
  uiTxtContractAddress:null,
  uiLblProjectState:null,
  scheduleModal: null,
  uiTxtShortCode: null,
  uiTxtScheduleDescription: null,
  uiTxtScheduleValue: null,
  uiTblScheduleTable: null,
  uiTblScheduleTableBody: null,

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
      this.retrieveFreelancer(this.uiTxtContractAddress);
    }
  },

  btnGoClient: function(){
    this.uiTxtContractAddress = document.getElementById("txt-contract-address").value;
    this.retrieveFreelancer(this.uiTxtContractAddress);
  },

  btnAddSchedule: function(){
    if (document.getElementById("Schedule-Form").checkValidity()){
      this.uiTxtShortCode = document.getElementById("txt-short-code").value;
      this.uiTxtScheduleDescription = document.getElementById("txt-schedule-description").value;
      this.uiTxtScheduleValue = document.getElementById("txt-schedule-value").value;
      this.uiSpnAddSchedule = document.getElementById("spn-add-schedule")
      this.uiSpnAddSchedule.classList.remove('d-none');
      this.freelancerContract.methods.addSchedule(this.uiTxtShortCode, this.uiTxtScheduleDescription, App.web3.utils.toWei(this.uiTxtScheduleValue, 'ether')).send({from: this.account}).then((result) =>{
        this.uiTblScheduleTable = document.getElementById("tbl-schedule-table");
        this.uiTblScheduleTable.classList.remove('d-none');  
        this.uiSpnAddSchedule.classList.add('d-none');
        this.scheduleModal = Modal.getInstance(document.getElementById('scheduleModal'));
        this.utilAddScheduleToTable(this.uiTxtShortCode, this.uiTxtScheduleDescription, App.web3.utils.toWei(this.uiTxtScheduleValue, 'ether'), 0);
        this.scheduleModal.hide();
      });
    }
    else{
      console.log("nope");
    }
  },

  utilScheduleState: function(stateCode){
    //planned, funded, started, approved, released
    switch(stateCode){
      case 0:
        return "<span class='badge bg-primary'>Planned</span>";
      case 1:
        return "<span class='badge bg-success'>Funded</span>";
      case 2:
        return "<span class='badge bg-warning'>Started</span>";
      case 3:
        return "<span class='badge bg-info'>Approved</span>";
      case 4:       
        return "<span class='badge bg-light'>Released</span>";
    }
  },

  utilProjectStatus: function(statusCode){
    //initiated, accepted, closed
    this.uiLblProjectState = document.getElementById("lbl-project-status");
    switch(statusCode){
      case 0:
        this.uiLblProjectState.classList.add('bg-primary');
        this.uiLblProjectState.textContent = "Initiated";
        break;
      case 1:
        this.uiLblProjectState.classList.add('bg-success');
        this.uiLblProjectState.textContent = "Accepted";
        break;
      case 2:
        this.uiLblProjectState.classList.add('bg-warning');
        this.uiLblProjectState.textContent = "Closed";
        break;
    }
  },

  utilAddScheduleToTable: function(shortcode, description, value, state){
    let tr;
    let td; 

    this.uiTblScheduleTableBody = document.getElementById("schedule-table-body");    
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.innerHTML = shortcode;
    tr.appendChild(td);
    this.uiTblScheduleTableBody.appendChild(tr);

    td = document.createElement("td");
    td.innerHTML = description;
    tr.classList.add("table-active");
    tr.appendChild(td);
    this.uiTblScheduleTableBody.appendChild(tr);

    td = document.createElement("td");
    td.innerHTML = value/1000000000000000000;
    td.classList.add('text-end');
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = this.utilScheduleState(parseInt(state));
    tr.appendChild(td);

    td = document.createElement("td");
    tr.appendChild(td);

    this.uiTblScheduleTableBody.appendChild(tr);
  },

  utilRefreshScheduleTable: async function(){
    this.uiTblScheduleTable = document.getElementById("tbl-schedule-table"); 
    this.uiTblScheduleTable.classList.remove('d-none');  

    while (this.uiTblScheduleTable.rows[1]){
      this.uiTblScheduleTable.deleteRow(1);
    }

    let totalRow;

    await this.freelancerContract.methods.totalSchedules().call().then((result) => {
      totalRow = result;
    });

    for (let i=0; i<= totalRow-1; i++){
      await this.freelancerContract.methods.scheduleRegister(i).call().then((result)=>{
        this.utilAddScheduleToTable(result["shortCode"], result["description"], result["value"], result["scheduleState"]);
      });
    }
  },

  retrieveFreelancer: async function(ContractAddress){
    console.log(ContractAddress);
    const { web3 } = this;
    this.freelancerContract = new web3.eth.Contract(freelancerArtifact.abi, ContractAddress);
    console.log(this.freelancerContract);
    this.uiConContract = document.getElementById("con-contract");
    this.uiLblContractAddress = document.getElementById("lbl-contract-address");
    this.uiLblFreelancerAddress = document.getElementById("lbl-freelancer-address");

    this.uiConContract.classList.remove('d-none');

      this.uiLblContractAddress.textContent = ContractAddress;
      this.freelancerContract.methods.freelancerAddress().call().then((result) =>{
        this.uiLblFreelancerAddress.textContent = result;
      });

      this.freelancerContract.methods.projectState().call().then((result) =>{
        this.utilProjectStatus(0);
      });

      this.utilRefreshScheduleTable();
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

      this.utilRefreshScheduleTable();

    })
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