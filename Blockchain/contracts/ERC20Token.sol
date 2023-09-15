// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Basic ERC20 used as stablecoin on testnet
 */
contract ERC20Token is ERC20 {
	uint8 private _decimals;

	constructor(string memory name, string memory symbol, uint8 decimals_, uint256 totalSupply) ERC20(name, symbol) {
		_decimals = decimals_;
		_mint(msg.sender, totalSupply);
	}

	function decimals() public view virtual override returns (uint8) {
		return _decimals;
	}
}
