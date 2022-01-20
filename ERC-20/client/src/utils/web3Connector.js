import Web3 from 'web3';
import BrownieTokenSale from '../build/contracts/BrownieTokenSale.json';
import BrownieToken from '../build/contracts/BrownieToken.json';

export const loadWeb3 = async () => {
    //connect web3 with http provider
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };


  export const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    //get network id
    const networkId = await web3.eth.net.getId();
    //get network id details from abi
    const tokenSale = BrownieTokenSale.networks[networkId];
    const token = BrownieToken.networks[networkId];
    if (token && tokenSale) {
      //connect smart contract with web3
      
      const _tokenSale = new web3.eth.Contract(
        BrownieTokenSale.abi,
        tokenSale.address
      );

      const _token = new web3.eth.Contract(
        BrownieToken.abi,
        token.address
      );

      const tokenPrice = await _tokenSale.methods.tokenPrice().call();
      const tokenPriceInETH = web3.utils.fromWei(tokenPrice, 'ether')
      
    //  console.log(await _token.methods.balanceOf(account).call())

      return {
          saleToken:_tokenSale,
          brownie:_token,
          account,
          tokenPrice:tokenPriceInETH
        };

    } else {
      alert("wallet not connected");
    }
  };


