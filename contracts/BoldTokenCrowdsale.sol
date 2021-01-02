// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Crowdsale.sol";
import "./MintedCrowdsale.sol";
import "./KycContract.sol";

contract BoldTokenCrowdsale is MintedCrowdsale {
    KycContract kyc;

    constructor(uint256 _rate, address payable _wallet, IERC20 _token, KycContract _kyc) MintedCrowdsale() Crowdsale(_rate, _wallet, _token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.KycCompleted(msg.sender), "KYC not completed, purchase not allowed");
    }
}