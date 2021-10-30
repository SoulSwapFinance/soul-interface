// SPDX-License-Identifer: MIT

pragma solidity ^0.8.7;
    
    interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

    contract EnchantmentHelper {
    
    IERC20 seance = IERC20(0x124B06C5ce47De7A6e9EFDA71a946717130079E6);
    IERC20 enchant = IERC20(0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a);

    function getEnchantedSeance() public view returns (uint enchantedSeance) {
        return seance.balanceOf(address(enchant));
        
    }
    
}