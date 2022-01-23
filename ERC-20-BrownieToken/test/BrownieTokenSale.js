const BrownieTokenSale = artifacts.require("BrownieTokenSale");
const BrownieToken = artifacts.require("BrownieToken");
 
contract('BrownieTokenSale', async(accounts) => {
    var instance;
    var tokenInstance;
    var admin = accounts[0];
    var buyer = accounts[5];
    var tokenPrice = 1000000000000000;
    var noOfToken ;
    var tokensAvailable = 85000;
    before(async() => {
        instance = await BrownieTokenSale.deployed();
        tokenInstance = await BrownieToken.deployed();
      }) 


    it("Initialize contract with correct value", async ()=> {
        assert.equal(await instance.tokenPrice(),tokenPrice,"Token price incorrect")
    })

    it("Transfer token from brownie contract to sell contract", async ()=> {
        
        const balanceOfAdminBefore = await tokenInstance.balanceOf(admin)
        await tokenInstance.transfer(instance.address,tokensAvailable,{from:admin})
        const balanceOfContract = await tokenInstance.balanceOf(instance.address)
        const balanceOfAdminNow = await tokenInstance.balanceOf(admin)
        assert.equal(balanceOfContract.toNumber(), tokensAvailable, 'Token transfer to crowd sell');
        assert.equal(balanceOfAdminNow.toNumber(), balanceOfAdminBefore.toNumber()-tokensAvailable, 'Token deducted');
   })

    it("Purchase brownie token", async ()=> {
        noOfToken = 10;
        const balanceOfContractBefore = await tokenInstance.balanceOf(instance.address)
        const Purchase = await instance.buyToken(noOfToken,{from:buyer,value:noOfToken*tokenPrice})
        const balanceOfBuyer = await tokenInstance.balanceOf(buyer)
        const balanceOfContractNow = await tokenInstance.balanceOf(instance.address)

        assert.equal(Purchase.receipt.logs.length, 1, 'triggers one event');
        assert.equal(Purchase.receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
        assert.equal(Purchase.receipt.logs[0].args.buyer, buyer, 'logs the account has purchased the token');
        assert.equal(Purchase.receipt.logs[0].args.noOfToken, noOfToken, 'logs the no of token purchased');

        const tokenSold = await instance.tokenSold()
        assert.equal(tokenSold.toNumber(), noOfToken, 'no of token sold is not equal to no of token purchased');
        assert.equal(balanceOfContractNow.toNumber(), balanceOfContractBefore.toNumber()-10, '1O token deducted from contract');
        assert.equal(balanceOfBuyer.toNumber(), 10, 'Buyer received 10 token');
   })

})