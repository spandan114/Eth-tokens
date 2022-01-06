
const BrownieToken = artifacts.require("BrownieToken");
 
contract('BrownieToken', async(accounts) => {
//   it("should return the list of accounts", async ()=> {
//     console.log(accounts);
//   });
const instance = await BrownieToken.deployed();

it("Total supply should match with 100000", async ()=> {
    const supply = await instance.totalSupply_();
    assert.equal(supply, 100000,"Total supply must 100000");
  });
});