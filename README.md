Soroban Project
===============

Project Structure
-----------------

This repository follows the recommended structure for a Soroban project:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   textCopy code.  ├── contracts  │   └── hello_world  │       ├── src  │       │   ├── lib.rs  │       │   └── test.rs  │       └── Cargo.toml  ├── Cargo.toml  └── README.md   `

### Key Points:

*   New Soroban contracts can be placed inside the contracts directory, with each contract having its own folder.
    
*   The hello\_world contract is provided as an example to get started.
    
*   If you initialized the project with other example contracts via the --with-example flag, those will also be in the contracts directory.
    
*   Each contract has its own Cargo.toml for dependencies, relying on the top-level Cargo.toml workspace.
    
*   Frontend libraries (if included) can be placed at the top level of the project directory.
    

Set Up Environment / Project Installation Guide
-----------------------------------------------

### A) **Environment Setup**

#### 1\. Install Rust

Run the following command to install Rust:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codecurl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh   `

#### 2\. Install Soroban CLI

Install the Soroban CLI using the following command:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codecargo install --locked soroban-cli   `

For more information, visit the Soroban documentation.

#### 3\. Install Node.js

Make sure Node.js is installed on your system. You can download it from [here](https://nodejs.org/).

#### 4\. Install Freighter Wallet

*   Get the Freighter Wallet extension for your browser.
    
*   After enabling it, go to the **network section** and connect your wallet to the **testnet**.
    

#### 5\. Install wasm32-unknown-unknown Target

Run the following command to add the WebAssembly target:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy coderustup target add wasm32-unknown-unknown   `

#### 6\. Configure Soroban CLI for Testnet

Configure the Soroban CLI to interact with the testnet using the following command:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban network add \    --global testnet \    --rpc-url https://soroban-testnet.stellar.org:443 \    --network-passphrase "Test SDF Network ; September 2015"   `

### B) **Setting Up the Project**

1.  **Clone the Repository:**
    

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codegit clone https://github.com/NayanSubedi/Stellar-Product_CRUD  cd product-crud   `

Testing and Deploying the Contract
----------------------------------

### 1\. **Generate an Account**

To deploy the contract, you will need an account. You can either use your Freighter Wallet account or generate a new account on the testnet:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban keys generate --global alice --network testnet   `

To view the public key of the account:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban keys address alice   `

### 2\. **Build the Contract**

To build the smart contract, use the following command:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban contract build   `

Alternatively, you can use Cargo directly:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codecargo build --target wasm32-unknown-unknown --release   `

### 3\. **Install Optimizer (Optional)**

If you need to optimize the contract, install the optimizer tool with:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codecargo install --locked soroban-cli --features opt   `

### 4\. **Optimize the Contract (Optional)**

To optimize the contract for deployment, run the following command:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban contract optimize --wasm target/wasm32-unknown-unknown/release/hello_world.wasm   `

### 5\. **Deploy the Contract**

To deploy the contract to the testnet, use the following command:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codestellar contract deploy --wasm target/wasm32-unknown-unknown/release/hello_world.wasm --network testnet --source nyn   `

### 6\. **Invoke Functions from the Smart Contract**

You can invoke functions in the deployed smart contract using the following command format:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`bashCopy codesoroban contract invoke \    --id  \    --source  \    --network testnet \    -- \    --` 

Below are example commands to invoke different functions in the ProductContract:

#### 1\. **Create a Product**

To create a new product:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban contract invoke \    --id  \    --source  \    --network testnet \    -- create_product --name "Sample Product" --description "A description of the sample product." --price 1000   `

#### 2\. **Get a Product by ID**

To retrieve a product by its ID:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban contract invoke \    --id  \    --source  \    --network testnet \    -- get_product_by_id --product_id 1   `

#### 3\. **Update a Product**

To update an existing product:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban contract invoke \    --id  \    --source  \    --network testnet \    -- update_product --product_id 1 --new_name "Updated Product" --new_description "Updated description of the product." --new_price 1200   `

#### 4\. **Delete a Product**

To delete a product by ID:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codesoroban contract invoke \    --id  \    --source  \    --network testnet \    -- delete_product --product_id 1   `

Conclusion
----------

Following these steps, you will be able to set up, test, and deploy Soroban smart contracts on the testnet. The provided examples demonstrate how to interact with the ProductContract, which allows basic CRUD operations on products.

Make sure to replace placeholders like and with actual values when invoking functions.