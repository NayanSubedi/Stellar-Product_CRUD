# Soroban Project

## Project Structure

This repository uses the recommended structure for a Soroban project:
```text
.
├── contracts
│   └── hello_world
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```

- New Soroban contracts can be put in `contracts`, each in their own directory. There is already a `hello_world` contract in there to get you started.
- If you initialized this project with any other example contracts via `--with-example`, those contracts will be in the `contracts` directory as well.
- Contracts should have their own `Cargo.toml` files that rely on the top-level `Cargo.toml` workspace for their dependencies.
- Frontend libraries can be added to the top-level directory as well. If you initialized this project with a frontend template via `--frontend-template` you will have those files already included.





## Set Up Environment / Project Installation Guide
## - A) Environment Setup:
## - 1.Install Rust, using command:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

## Install the Soroban CLI using below mentioned command. For more info visit => Soroban docs
cargo install --locked soroban-cli

Install Node.js

# -2.Get the Freighter Wallet extension for you browser.
- Once enabled, then got to the network section and connect your wallet to the testnet.

- Install wasm32-unknown-unknown package using command:

rustup target add wasm32-unknown-unknown

- To configure your CLI to interact with Testnet, run the following command:

soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

- Step 1: Setting Up the Project
git clone https://github.com/NayanSubedi/Stellar-Product_CRUD

cd product-crud

## Testing and Deploying the Contract
- In order to deploy the smartcontract you will need an account. You can either use the an account from the Freighter Wallet or can configure an account named alice in the testnet using the command:

soroban keys generate --global alice --network testnet

- You can see the public key of account alice:
soroban keys address alice

=> Go inside the /product-crud directory and do the below mentioned steps:

- Build the contract:
soroban contract build

- Alternte command:

cargo build --target wasm32-unknown-unknown --release

- Install Optimizer:
cargo install --locked soroban-cli --features opt

- Build an Opmize the contract:
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/hello_world.wasm 

- Steps to the Deploy smart-contract on testnet:
deploy the smartcontract on the testnet and get deployed address of the smartcontract using the following command:

stellar contract deploy --wasm target/wasm32-unknown-unknown/release/hello_world.wasm --network testnet --source nyn


## Invoke functions from the smart-contract:
 - To invoke any of the function from the smartcontract you can use this command fromat.
soroban contract invoke \
  --id <DEPLOYED_CONTRACT_ADDRESS> \
  --source <YOUR_ACCOUNT_NAME> \
  --network testnet \
  -- \
  <FUNCTION_NAME> --<FUNCTION_PARAMETER> <ARGUMENT>

- Here are example soroban contract invoke commands for each of the functions in the ProductContract smart contract, using dummy data. Replace <DEPLOYED_CONTRACT_ADDRESS>, <YOUR_ACCOUNT_NAME>, and other placeholders with actual values.

## 1. Create a Product
soroban contract invoke --id <DEPLOYED_CONTRACT_ADDRESS> --source <YOUR_ACCOUNT_NAME> --network testnet -- create_product --name "Sample Product" --description "A description of the sample product." --price 1000

## 2. Get a Product by ID
soroban contract invoke --id <DEPLOYED_CONTRACT_ADDRESS> --source <YOUR_ACCOUNT_NAME> --network testnet -- get_product_by_id --product_id 1

## 3. Update a Product
soroban contract invoke --id <DEPLOYED_CONTRACT_ADDRESS> --source <YOUR_ACCOUNT_NAME> --network testnet -- update_product --product_id 1 --new_name "Updated Product" --new_description "Updated description of the product." --new_price 1200

##4. Delete a Product
soroban contract invoke --id <DEPLOYED_CONTRACT_ADDRESS> --source <YOUR_ACCOUNT_NAME> --network testnet -- delete_product --product_id 1


