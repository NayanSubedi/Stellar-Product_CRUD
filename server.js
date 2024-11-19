import express from 'express';
import pkg from 'body-parser';
import { Contract, rpc, TransactionBuilder, Networks, BASE_FEE, nativeToScVal, Address, Keypair } from '@stellar/stellar-sdk';
const { json } = pkg;

const app = express();
const port = 3000;

// Define default caller address (for development purposes)
const DEFAULT_CALLER = "GD6736KXUEKGMHRCPJWZDWSZYRG7PU6UANKQ4X73EM75PGWCU7L7Y3NN";  // Replace with your actual account address

let rpcUrl = "https://soroban-testnet.stellar.org";
let contractAddress = "CCO2DTVUBSN6QCCVWMNVS3ZZZRXZB5OM2GSNCTNEEOZZBY3DU77C3ZI2"; // Replace with actual contract address

// Predefined private key (make sure to never expose this in production)
const PREDEFINED_PRIVATE_KEY = "SDCUEMZG3US4QFACMFPPMYUDW5GVOR5CQCCP2FXTNU4WHBQ36B4BJHYH"; // Replace with your private key

// Convert account address to ScVal
const accountToScVal = (account) => new Address(account).toScVal();

// Convert String to ScVal
const stringToScValString = (value) => {
  return nativeToScVal(value);
};

// Convert number to U64
const numberToU64 = (value) => {
  return nativeToScVal(value, { type: "u64" });
};

let params = {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
};

// Function to sign the transaction with the predefined private key
async function signTransaction(transactionXDR, privateKey) {
  const keypair = Keypair.fromSecret(privateKey);
  const transaction = TransactionBuilder.fromXDR(transactionXDR, Networks.TESTNET);
  transaction.sign(keypair);  // Sign the transaction with the private key
  return transaction.toXDR();  // Return the signed transaction in XDR format
}

// Function to call the contract's methods
async function contractInt(caller, functName, values) {
    const provider = new rpc.Server(rpcUrl, { allowHttp: true });
    const sourceAccount = await provider.getAccount(caller);
    const contract = new Contract(contractAddress);
    let buildTx;
  
    if (values == null) {
      buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName))
        .setTimeout(30)
        .build();
    } else if (Array.isArray(values)) {
      buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName, ...values))
        .setTimeout(30)
        .build();
    } else {
      buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName, values))
        .setTimeout(30)
        .build();
    }
  
    let _buildTx = await provider.prepareTransaction(buildTx);
    let prepareTx = _buildTx.toXDR(); // pre-encoding (converting it to XDR format)
  
    try {
      let signedTx = await signTransaction(prepareTx, PREDEFINED_PRIVATE_KEY);
  
      let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);
  
      let sendTx = await provider.sendTransaction(tx).catch(function (err) {
        console.error("Catch-1", err);
        return err;
      });
  
      if (sendTx.errorResult) {
        throw new Error("Unable to submit transaction");
      }
  
      if (sendTx.status === "PENDING") {
        let txResponse = await provider.getTransaction(sendTx.hash);
        while (txResponse.status === "NOT_FOUND") {
          txResponse = await provider.getTransaction(sendTx.hash);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
  
        if (txResponse.status === "SUCCESS") {
          // Log the entire response to inspect the structure
          console.log("Full transaction response:", txResponse);
  
          // The return value might not be directly accessible via `result.productId`
          let result = txResponse.returnValue;
  
          // Log the raw result to see its structure
          console.log("Raw result from contract:", result);
  
          // Try to access productId differently if needed
          if (result && result.productId) {
            let productId = result.productId;
            console.log("Product ID from contract:", productId);
            return productId;
          } else {
            console.log("Product ID not found in contract response.");
            return null;
          }
        }
      }
    } catch (err) {
      console.log("Catch-2", err);
      return;
    }
  }
  
  

// Middleware to parse JSON request bodies
app.use(json());

// Helper function to get caller from request (from headers or query parameters)
function getCaller(req) {
  const callerFromHeader = req.headers['authorization']?.split(' ')[1];  // Assume format: "Bearer your-source-account-address"
  const callerFromQuery = req.query.caller;
  return callerFromHeader || callerFromQuery || DEFAULT_CALLER;
}

// Create a new product
app.post('/products', async (req, res) => {
  const { name, description, price } = req.body;
  const caller = getCaller(req); // Get caller automatically

  if (!name || !description || price == null) {
    return res.status(400).send("Missing required parameters");
  }

  let nameScVal = stringToScValString(name);
  let descriptionScVal = stringToScValString(description);
  let priceScVal = numberToU64(price);

  try {
    let result = await contractInt(caller, "create_product", [nameScVal, descriptionScVal, priceScVal]);
    res.json({ productId: result });
  } catch (error) {
    res.status(500).send("Error creating product: " + error.message);
  }
});

// Get a product by ID
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const caller = getCaller(req); // Get caller automatically

  if (!productId) {
    return res.status(400).send("Missing required parameter: productId");
  }

  try {
    let result = await contractInt(caller, "get_product_by_id", [numberToU64(productId)]);
    res.json(result);
  } catch (error) {
    res.status(500).send("Error retrieving product: " + error.message);
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { name, description, price } = req.body;
  const caller = getCaller(req); // Get caller automatically

  if (!productId) {
    return res.status(400).send("Missing required parameter: productId");
  }

  let newNameScVal = name ? stringToScValString(name) : null;
  let newDescriptionScVal = description ? stringToScValString(description) : null;
  let newPriceScVal = price != null ? numberToU64(price) : null;

  try {
    await contractInt(caller, "update_product", [
      numberToU64(productId),
      newNameScVal,
      newDescriptionScVal,
      newPriceScVal,
    ]);
    res.send("Product updated successfully.");
  } catch (error) {
    res.status(500).send("Error updating product: " + error.message);
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const caller = getCaller(req); // Get caller automatically

  if (!productId) {
    return res.status(400).send("Missing required parameter: productId");
  }

  try {
    await contractInt(caller, "delete_product", [numberToU64(productId)]);
    res.send("Product deleted successfully.");
  } catch (error) {
    res.status(500).send("Error deleting product: " + error.message);
  }
});

// Get all products
app.get('/products', async (req, res) => {
  const caller = getCaller(req); // Get caller automatically

  try {
    let result = await contractInt(caller, "get_all_products", null);
    res.json(result);
  } catch (error) {
    res.status(500).send("Error fetching products: " + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
