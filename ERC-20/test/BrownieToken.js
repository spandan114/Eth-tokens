const BrownieToken = artifacts.require("BrownieToken");
 
contract('BrownieToken', async(accounts) => {
//   it("should return the list of accounts", async ()=> {
//     console.log(accounts);
//   });

    var instance;
    before(async() => {
      instance = await BrownieToken.deployed();
    }) 

  it("Initialize contract with correct value", async ()=> {
    const tokenName = await instance.name();
    const tokenSymbol = await instance.symbol()
    assert.equal(tokenName, "BrownieToken","Token name should be BrownieToken");
    assert.equal(tokenSymbol, "BT","Token symbol should be BT");
    
  });

  it("Total supply should match with 100000", async ()=> {
    const supply = await instance.totalSupply_();
    assert.equal(supply, 100000,"Total supply must 100000");
  });

  it("Balance of owner must be 100000", async ()=> {
    const ownerHolding = await instance.balanceOf(accounts[0]);
    assert.equal(ownerHolding, 100000,"Owner should hold all supply");
  });

  it("Transfer token", async ()=> {
   // await expect(await instance.transfer(accounts[1],9999999999)).to.be.rejectedWith("You dont have enough tokens")
    const transferBrownie =  await instance.transfer(accounts[1],1500,{from:accounts[0]})
    //Check emitted event data is correct or not
    // console.log(transferBrownie.receipt.logs)
    assert.equal(transferBrownie.receipt.logs.length, 1, 'triggers one event');
    assert.equal(transferBrownie.receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
    assert.equal(transferBrownie.receipt.logs[0].args.from, accounts[0], 'logs the account the tokens are transferred from');
    assert.equal(transferBrownie.receipt.logs[0].args.to, accounts[1], 'logs the account the tokens are transferred to');
    assert.equal(transferBrownie.receipt.logs[0].args.value.toNumber(), 1500, 'logs the transfer amount');

    assert.equal(await instance.balanceOf(accounts[1]), 1500,"Balance not received");
    assert.equal(await instance.balanceOf(accounts[0]),98500,"Balance not transferer");
  });


  it("Approve token for delighted transfer", async ()=> {
    
    const delegateBrownie = await instance.approve(accounts[1],1000,{from:accounts[0]})
    //Check emitted event data is correct or not
    assert.equal(delegateBrownie.receipt.logs.length, 1, 'triggers one event');
    assert.equal(delegateBrownie.receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
    assert.equal(delegateBrownie.receipt.logs[0].args.owner, accounts[0], 'logs the account the tokens are delighted from');
    assert.equal(delegateBrownie.receipt.logs[0].args.spender, accounts[1], 'logs the account the tokens are delighted to');
    assert.equal(delegateBrownie.receipt.logs[0].args.value.toNumber(), 1000, 'logs the transfer amount');
    const delegatedAmount = await instance.allowance(accounts[0],accounts[1]);
    assert.equal(delegatedAmount.toNumber(), 1000, 'Delegated amount must be 1000');
  })

  it("Handel delighted token transfer", async ()=> {
   await instance.transfer(accounts[1],1000,{from:accounts[0]})
   // await expect(await instance.transferFrom(accounts[3],accounts[4],10,{from:accounts[5]})).to.be.revertedWith("Allowance balance low")
   await instance.approve(accounts[2],1000,{from:accounts[1]})
   //Transfer amount from account1 to account2 using account0
   const transferFromBrownie = await instance.transferFrom(accounts[1],accounts[3],10,{from:accounts[2]})
   assert.equal(transferFromBrownie.receipt.logs.length, 1, 'triggers one event');
   assert.equal(transferFromBrownie.receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
   assert.equal(transferFromBrownie.receipt.logs[0].args.from, accounts[1], 'logs the account the tokens are transferred from');
   assert.equal(transferFromBrownie.receipt.logs[0].args.to, accounts[3], 'logs the account the tokens are transferred to');
   assert.equal(transferFromBrownie.receipt.logs[0].args.value.toNumber(), 10, 'logs the transfer amount');

   const receiverBalance = await instance.balanceOf(accounts[3])
   const allowanceBalance = await instance.allowance(accounts[1],accounts[2]);
   assert.equal(receiverBalance.toNumber(),10,"Token not transferer");
   assert.equal(allowanceBalance.toNumber(),990,"Token not deducted from allowance");
  })

});