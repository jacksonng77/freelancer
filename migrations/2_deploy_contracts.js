const freelancer = artifacts.require("freelancer");

module.exports = async function(deployer, network, accounts) {

    let programmerWallet;
    let clientWallet;
    //get address for programmer and client wallet
    await web3.eth.getAccounts().then(function(result){
        programmerWallet = result[0];
        clientWallet = result[1];
    });
    
    //deploy freelancer contract
    await deployer.deploy(freelancer, {from: programmerWallet}).then(()=> {
        console.log("Freelance Contract:" + freelancer.address);
      }
    );
    
    //add design phase to freelancer contract
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.addSchedule('DSP','Design Phase', web3.utils.toWei('1.25', 'ether'), {from: programmerWallet}).then(
              function(v) {
                console.log("Schedule Added:"+v.receipt.logs[0].args.shortCode);
              }
            )
        }
    );

    //add development phase to freelancer contract
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.addSchedule('DEV','Development Phase', web3.utils.toWei('2.34', 'ether'), {from: programmerWallet}).then(
              function(v) {
                console.log("Schedule Added:"+v.receipt.logs[0].args.shortCode);
              }
            )
        }
    );

    //add UAT phase to freelancer contract
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.addSchedule('UAT','User Acceptance Testing Phase', web3.utils.toWei('3.25', 'ether'), {from: programmerWallet}).then(
              function(v) {
                console.log("Schedule Added:"+v.receipt.logs[0].args.shortCode);
              }
            )
        }
    );

    //client accept freelancer contract
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.acceptProject({from: clientWallet}).then(
              function(v) {
                console.log("Contract Accepted By:"+v.receipt.logs[0].args.clientAddress);
              }
            )
        }
    );
    
    //client funds design phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.fundTask(0, {from: clientWallet, value: web3.utils.toWei("1.25", "ether")}).then(
              function(v) {
                console.log("Task Funded:"+v.receipt.logs[0].args.scheduleID);
              }
            )
        }
    );

    //programmer starts design phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.startTask(0, {from: programmerWallet}).then(
              function(v) {
                console.log("Task Started:"+v.receipt.logs[0].args.scheduleID);
              }
            )
        }
    );    

    //client approves design phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.approveTask(0, {from: clientWallet}).then(
              function(v) {
                console.log("Task Approved:"+v.receipt.logs[0].args.scheduleID);
              }
            )
        }
    );

    //programmer releases funds to himself
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.releaseFunds(0, {from: programmerWallet}).then(
              function(v) {
                console.log("Funds Released:"+v.receipt.logs[0].args.scheduleID);
              }
            )
        }
    );    

    //client funds development phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.fundTask(1, {from: clientWallet, value: web3.utils.toWei("2.34", "ether")}).then(
              function(v) {
                console.log("Task Funded:"+v.receipt.logs[0].args.scheduleID);
              }
            )
        }
    );

    //programmer starts development phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.startTask(1, {from: programmerWallet}).then(
              function(v) {
                console.log("Task Started:"+v.receipt.logs[0].args.scheduleID);
              }
            )
        }
    );    

    //client approves development phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.approveTask(1, {from: clientWallet}).then(
              function(v) {
                console.log("Task Approved:"+v.receipt.logs[0].args.scheduleID);
              }
            )
        }
    );

    //programmer releases funds to himself
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.releaseFunds(1, {from: programmerWallet}).then(
                function(v) {
                    console.log("Funds Released:"+v.receipt.logs[0].args.scheduleID);
                }
            )
        }
    );  

    //client funds UAT phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.fundTask(2, {from: clientWallet, value: web3.utils.toWei("3.25", "ether")}).then(
                function(v) {
                    console.log("Task Funded:"+v.receipt.logs[0].args.scheduleID);
                }
            )
        }
    );
    
    //programmer starts UAT phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.startTask(2, {from: programmerWallet}).then(
                function(v) {
                    console.log("Task Started:"+v.receipt.logs[0].args.scheduleID);
                }
            )
        }
    );    
    
    //client approves UAT phase
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.approveTask(2, {from: clientWallet}).then(
                function(v) {
                    console.log("Task Approved:"+v.receipt.logs[0].args.scheduleID);
                }
            )
        }
    );
    
    //programmer releases funds to himself
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.releaseFunds(2, {from: programmerWallet}).then(
                function(v) {
                    console.log("Funds Released:"+v.receipt.logs[0].args.scheduleID);
                }
            )
        }
    ); 

    //programmer ends project
    await freelancer.deployed().then(
        async function(contractInstance) {
            await contractInstance.endProject({from: programmerWallet}).then(
                function(v) {
                    console.log("Project Ended");
                }
            )
        }
    ); 
};