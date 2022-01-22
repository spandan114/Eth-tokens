import React, { useState, useEffect } from "react";
import "./App.css";
import { loadBlockchainData, loadWeb3 } from "./utils/web3Connector";

const App = () => {
  const [account, setAccount] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenOwned, setTokenOwned] = useState(0);
  const [contract, setContract] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [tokenSold, setTokenSold] = useState(0);
  const totalToken = 75000;

  useEffect(() => {
    const load = async () => {
      await loadWeb3();
      const contractData = await loadBlockchainData();
      setAccount(contractData.account);
      setContract(contractData.saleToken);
      setTokenPrice(contractData.tokenPrice)
      const _tokenSold = await contractData.saleToken.methods.tokenSold().call()
      const _tokenOwned = await contractData.brownie.methods.balanceOf(contractData.account).call()
      setTokenSold(_tokenSold)
      setTokenOwned(_tokenOwned)
    };
    load();
  }, []);

  const purchesBrownie = async() =>{
    const web3 = window.web3;
    
    const receipt = await contract.methods.buyToken(tokenAmount)
    .send({
      from:account,
      value:web3.utils.toBN(web3.utils.toWei((tokenPrice*tokenAmount).toString(), 'ether'))
    })
    .on('transactionHash', function(hash){
         console.log(hash)
     })
     .on('error', function(error){ 
       console.log(error)
     })

     console.log(receipt.events.Sell)

  }

  return (
    <div className="App">
      <div className="App-header mx-auto">
        <h3>Brownie token sell</h3>
        <p>Token price is {tokenPrice} ETH. You are currently holding {tokenOwned} Brownie token .</p>
        <p>{tokenSold}/{totalToken} tokens sold</p>
        {contract ? (
          <>
            <div className="input-group mt-3 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buy brownie token ."
                value={tokenAmount}
                onChange={e=>setTokenAmount(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  className="btn bg-success"
                  type="button"
                  id="button-addon2"
                  onClick={()=>purchesBrownie()}
                >
                  Buy tokens
                </button>
              </div>
            </div>

            <div className="progress mt-3 mb-3">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${Math.round((tokenSold/totalToken)*100)}%` }}
                aria-valuenow={((tokenSold/totalToken)*100)}
                aria-valuemin="0"
                aria-valuemax={totalToken*100}
              >
                {((tokenSold/totalToken)*100).toFixed()}%
              </div>
            </div>
            <p>{account}</p>
          </>
        ) : (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
