// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract BrownieToken {
    //Total supply
    uint256 public totalSupply_;
    string public name = "BrownieToken";
    string public symbol = "BT";
    mapping(address=>uint256) public balanceOf;


    event Transfer(address from, address to, uint256 value);
    // event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = 100000;
        totalSupply_ = 100000;
    }

    // function allowance(address owner, address spender) external view returns (uint256){

    // }

    function transfer(address to, uint256 amount) external returns (bool){
        //Exception if account doesnt exist
        require(balanceOf[msg.sender] >= amount);
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        //emit event
        emit Transfer(msg.sender,to,amount);
        //return boolean
        return true;
    }

    // function approve(address spender, uint256 amount) external returns (bool){

    // }

    // function transferFrom(address sender, address recipient, uint256 amount) external returns (bool){

    // }

}