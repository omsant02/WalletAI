use core::array::ArrayTrait;
use core::result::ResultTrait;
use starknet::{ContractAddress, contract_address_const};
use snforge_std::{declare, ContractClassTrait, start_prank, stop_prank};
use super::super::basic_wallet::BasicWallet;

#[test]
fn test_wallet_deployment() {
    // Declare the contract
    let contract = declare('BasicWallet');
    
    // Test public key
    let public_key = 0x123;
    
    // Deploy the wallet
    let contract_address = contract.deploy(
        array![public_key]
    ).unwrap();

    // Basic assertion that deployment worked
    assert(!contract_address.is_zero(), 'Deployment failed');
}