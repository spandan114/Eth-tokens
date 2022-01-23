// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import './BrownieToken.sol';

contract BrownieTokenSale {
     address public admin ;
     BrownieToken public tokenContract;
     uint256 public tokenPrice;
     uint256 public tokenSold;

    event Sell(address buyer, uint256 noOfToken);

     constructor(BrownieToken _tokenContract, uint256 _tokenPrice){
         admin=msg.sender;
         tokenContract = _tokenContract;
         tokenPrice = _tokenPrice;
     }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

     function buyToken(uint256 _noOfToken) public payable {
         // validate value
         require(msg.value == multiply(tokenPrice,_noOfToken));
        //check contract have enough token
        require(tokenContract.balanceOf(address(this)) >= _noOfToken);
        //Transfer is successfull
        require(tokenContract.transfer(msg.sender, _noOfToken));
        //keep track of sold
        tokenSold += _noOfToken;
        //emit sell event
        emit Sell(msg.sender,_noOfToken);
     }

    function endToken() public {
        //Only admin can end the sell
        require(msg.sender == admin,"Only admin can and the sell");
        //Return remaining token to admin
        uint remainingToken = tokenContract.balanceOf(address(this));
        tokenContract.transfer(admin, remainingToken);
        //Destroy contract
        selfdestruct(payable(admin));
    }

}  