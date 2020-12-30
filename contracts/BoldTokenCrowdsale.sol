// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;

import "./Crowdsale.sol";
import "./KycContract.sol";

contract BoldTokenCrowdsale is Crowdsale {

    KycContract kyc;

    constructor(uint256 rate, address payable wallet, IERC20 token, KycContract _kyc) Crowdsale(rate, wallet, token) public {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.KycCompleted(msg.sender), "KYC not completed, purchase not allowed");
    }
}