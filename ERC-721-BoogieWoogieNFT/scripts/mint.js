require('dotenv').config();
const { ALCHEMY_KEY,NFT_CONTRACT_ADDRESS ,ACCOUNT_PUBLIC_KEY,ACCOUNT_PRIVATE_KEY} = process.env; 

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const alchemyWeb3 = createAlchemyWeb3(`https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`);
const contract = require("../artifacts/contracts/MintNft.sol/BoogieWoogie.json"); 
const nftContract = new alchemyWeb3.eth.Contract(contract.abi, NFT_CONTRACT_ADDRESS);

async function mintNFT(tokenURI) {
    // get the nonce - nonce is needed for security reasons. It keeps track of the number of
    // transactions sent from our address and prevents replay attacks.
  const nonce = await alchemyWeb3.eth.getTransactionCount(ACCOUNT_PUBLIC_KEY, 'latest');
  const tx = {
    from: ACCOUNT_PUBLIC_KEY, // our MetaMask public key
    to: NFT_CONTRACT_ADDRESS, // the smart contract address we want to interact with
    nonce: nonce, // nonce with the no of transactions from our account
    gas: 1000000, // fee estimate to complete the transaction
    value:10000000000000000,
    data: nftContract.methods
      .safeMint(ACCOUNT_PUBLIC_KEY, tokenURI)
      .encodeABI(), // call the createNFT function from our OsunRiverNFT.sol file and pass the account that should receive the minted NFT.
  };

  const signPromise = alchemyWeb3.eth.accounts.signTransaction(
    tx,
    ACCOUNT_PRIVATE_KEY
  );

  signPromise
    .then((signedTx) => {
      alchemyWeb3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of our transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of our transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting our transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });

}

mintNFT("https://ipfs.io/ipfs/QmdZMtdApdeobM5iCRcWqAMByfG4No8tW4oheb7jQjKgTm") 