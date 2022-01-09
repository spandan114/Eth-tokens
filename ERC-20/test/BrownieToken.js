
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

});