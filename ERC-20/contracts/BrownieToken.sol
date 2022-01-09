// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract BrownieToken {
    //Total supply
    uint256 public totalSupply_;
    string public name = "BrownieToken";
    string public symbol = "BT";
    mapping(address=>uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;

    event Transfer(address from, address to, uint256 value);
    event Approval(address owner, address spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = 100000;
        totalSupply_ = 100000;
    }

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

    function approve(address spender, uint256 amount) external returns (bool){
       allowance[msg.sender][spender] = amount;
       emit Approval(msg.sender,spender,amount);
       return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool){

        require(amount <= balanceOf[sender],'Account balance low');
        //Check sender must have enough amount of token in allowence to transfer
        require(amount <= allowance[sender][msg.sender],'Allowance balance low');
        //Update allowence
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        //Emit event
        emit Transfer(sender,recipient,amount);
        return true;
    }

}