#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod polkadot {
    use ink::storage::Mapping;

    #[ink(storage)]
    #[derive(Default)]
    pub struct Polkadot {
        /// Mapping of intents
        intents: Mapping<Hash, Intent>,
        /// Mapping of bridges
        bridges: Mapping<Hash, Bridge>,
        /// Mapping of swap pairs
        swap_pairs: Mapping<(AccountId, AccountId), Balance>,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum IntentType {
        Swap,
        Bridge,
        AddLiquidity,
        RemoveLiquidity,
        Stake,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Intent {
        intent_type: IntentType,
        creator: AccountId,
        amount: Balance,
        timeout: Timestamp,
        executed: bool,
        target_token: Option<Vec<u8>>,
        min_amount_out: Option<Balance>,
        execution_mode: Option<ExecutionMode>,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum ExecutionMode {
        Normal,
        Fast,
        Secure,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Bridge {
        from_chain: Vec<u8>,
        to_chain: Vec<u8>,
        amount: Balance,
        recipient: AccountId,
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        IntentNotFound,
        IntentAlreadyExecuted,
        IntentExpired,
        InsufficientBalance,
        BridgeError,
        InvalidParameters,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    impl Polkadot {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self::default()
        }

        /// Creates a new intent
        #[ink(message)]
        pub fn create_intent(
            &mut self,
            intent_type: IntentType,
            amount: Balance,
            timeout_minutes: u64,
            target_token: Option<Vec<u8>>,
            min_amount_out: Option<Balance>,
            execution_mode: Option<ExecutionMode>,
        ) -> Result<Hash> {
            let caller = self.env().caller();
            let current_time = self.env().block_timestamp();
            let timeout = current_time + (timeout_minutes * 60 * 1000);

            let intent = Intent {
                intent_type,
                creator: caller,
                amount,
                timeout,
                executed: false,
                target_token,
                min_amount_out,
                execution_mode,
            };

            let intent_hash = self.env().hash_encoded::<Blake2x256, _>(&intent);
            self.intents.insert(&intent_hash, &intent);

            Ok(intent_hash)
        }

        /// Execute an intent
        #[ink(message)]
        pub fn execute_intent(&mut self, intent_hash: Hash) -> Result<()> {
            let intent = self.intents.get(&intent_hash).ok_or(Error::IntentNotFound)?;
            
            if intent.executed {
                return Err(Error::IntentAlreadyExecuted)
            }

            if self.env().block_timestamp() > intent.timeout {
                return Err(Error::IntentExpired)
            }

            // Mark intent as executed
            let mut updated_intent = intent.clone();
            updated_intent.executed = true;
            self.intents.insert(&intent_hash, &updated_intent);

            Ok(())
        }

        /// Bridge tokens
        #[ink(message)]
        pub fn bridge_tokens(
            &mut self,
            to_chain: Vec<u8>,
            amount: Balance,
            recipient: AccountId,
        ) -> Result<Hash> {
            let caller = self.env().caller();
            let from_chain = b"BOB Sepolia".to_vec();

            let bridge = Bridge {
                from_chain,
                to_chain,
                amount,
                recipient,
            };

            let bridge_hash = self.env().hash_encoded::<Blake2x256, _>(&bridge);
            self.bridges.insert(&bridge_hash, &bridge);

            Ok(bridge_hash)
        }

        /// Add liquidity to a swap pair
        #[ink(message)]
        pub fn add_liquidity(
            &mut self,
            token_address: AccountId,
            amount: Balance,
        ) -> Result<()> {
            let caller = self.env().caller();
            let current_liquidity = self.swap_pairs.get(&(caller, token_address)).unwrap_or(0);
            self.swap_pairs.insert(&(caller, token_address), &(current_liquidity + amount));
            
            Ok(())
        }

        /// Remove liquidity from a swap pair
        #[ink(message)]
        pub fn remove_liquidity(
            &mut self,
            token_address: AccountId,
            amount: Balance,
        ) -> Result<()> {
            let caller = self.env().caller();
            let current_liquidity = self.swap_pairs.get(&(caller, token_address)).unwrap_or(0);
            
            if current_liquidity < amount {
                return Err(Error::InsufficientBalance)
            }

            self.swap_pairs.insert(&(caller, token_address), &(current_liquidity - amount));
            
            Ok(())
        }
    }
}
