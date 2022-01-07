
const BrownieToken = artifacts.require("BrownieToken");
 
contract('BrownieToken', async(accounts) => {
//   it("should return the list of accounts", async ()=> {
//     console.log(accounts);
//   });
const instance = await BrownieToken.deployed();

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
    await expect(instance.transfer.call(accounts[1],9999999999)).to.be.revertedWith("You dont have enough tokens")
    await instance.transfer.call(accounts[1],1500,{from:accounts[0]})
    assert.equal(await instance.balanceOf(accounts[1]), 1500,"Balance not received");
    const ownerBalance = await instance.balanceOf(accounts[0])
    assert.equal(await instance.balanceOf(accounts[0]),ownerBalance-1500,"Balance not transferer");
  });

});