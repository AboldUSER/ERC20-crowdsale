// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20Mintable.sol";

contract BTestToken is ERC20Mintable {

    constructor() public ERC20("BTest", "BOLDTEST") ERC20Mintable() {
        _setupDecimals(0);
    }
}