#[starknet::contract]
mod WalletToken {
    use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::Map;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    // ERC20 Mixin
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        address_amounts: Map::<ContractAddress, u256>,
        owner: ContractAddress,  // Add owner storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        initial_supply: u256,
        recipient: ContractAddress
    ) {
        let name = "WalletToken";
        let symbol = "WTK";

        self.erc20.initializer(name, symbol);
        self.erc20.mint(recipient, initial_supply);
        self.owner.write(recipient);  // Set owner as the deployer

        let address1: ContractAddress = 0x123.try_into().unwrap();
        let address2: ContractAddress = 0x456.try_into().unwrap();
        let address3: ContractAddress = 0x789.try_into().unwrap();

        // Set all initial amounts to 0
        self.address_amounts.write(address1, 0_u256);
        self.address_amounts.write(address2, 0_u256);
        self.address_amounts.write(address3, 0_u256);
    }

    #[starknet::interface]
    trait IWalletToken<TContractState> {
        fn get_address_amount(self: @TContractState, address: ContractAddress) -> u256;
        fn simulate_transfer(ref self: TContractState, from: ContractAddress, to: ContractAddress, amount: u256) -> bool;
        fn get_owner(self: @TContractState) -> ContractAddress;
    }

    #[abi(embed_v0)]
    impl WalletTokenImpl of IWalletToken<ContractState> {
        fn get_address_amount(self: @ContractState, address: ContractAddress) -> u256 {
            self.address_amounts.read(address)
        }

        // New function to simulate transfers for AI demo
        fn simulate_transfer(
            ref self: ContractState, 
            from: ContractAddress, 
            to: ContractAddress, 
            amount: u256
        ) -> bool {
            // Only owner can call this function
            assert(get_caller_address() == self.owner.read(), 'Only owner can simulate');
            
            // Get current balances
            let from_balance = self.address_amounts.read(from);
            let to_balance = self.address_amounts.read(to);
            
            // Check if from_address has enough balance
            assert(from_balance >= amount, 'Insufficient balance');
            
            // Update balances
            self.address_amounts.write(from, from_balance - amount);
            self.address_amounts.write(to, to_balance + amount);
            
            true
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }
    }
}