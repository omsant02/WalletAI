// mod BasicWallet;  // Main contract module

// #[cfg(test)]
// mod test {
//     mod BasicWallet;  // Test module
// }


#[starknet::contract(account)]
mod CustomWallet {
    use starknet::{ContractAddress, ClassHash};
    use openzeppelin_account::AccountComponent;
    use openzeppelin_introspection::src5::SRC5Component;
    use starknet::account::Call;

    // Components
    component!(path: AccountComponent, storage: account, event: AccountEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // Account Mixin Implementation
    #[abi(embed_v0)]
    impl AccountMixinImpl = AccountComponent::AccountMixinImpl<ContractState>;
    impl AccountInternalImpl = AccountComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        account: AccountComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AccountEvent: AccountComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, public_key: felt252) {
        self.account.initializer(public_key);
    }

    // Custom function to transfer ETH
    #[external(v0)]
    fn transfer_eth(
        ref self: ContractState,
        to: ContractAddress,
        amount: u256
    ) -> felt252 {
        // Create call to transfer ETH
        let calls = array![Call {
            to: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7.try_into().unwrap(),
            selector: selector!("transfer"),
            calldata: array![to.into(), amount.low.into(), amount.high.into()].span()
        }];

        // Execute the call using AccountComponent's execute
        self.account.__execute__(calls);

        'TRANSFER_SUCCESSFUL'
    }
}