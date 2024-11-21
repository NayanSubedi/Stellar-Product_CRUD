// import express from 'express';
// import pkg from 'body-parser';
// import { Contract, rpc, TransactionBuilder, Networks, BASE_FEE, nativeToScVal, Address, scValToNative,Keypair } from '@stellar/stellar-sdk';
// const { json } = pkg;





// const app = express();
// const port = 3000;

// const DEFAULT_CALLER = "GBMBKMNMVTARF2GF2JB4OU4KLYOPKRPLP23ZDKNID4YA262J6VPQXRH6";  

// let rpcUrl = "https://soroban-testnet.stellar.org";
// let contractAddress = "CDD5UV5QKXQNI54AMG5RXO26RZAZJLL7EMP67CLNLA3YL34EG3POFJE2"; 

// const PREDEFINED_PRIVATE_KEY = "SDWHOM76HHHIXBEKASSF4GFYWVSB7THSH7TOJXKDGMGJN7QGUMDOUYPB"; 


// const accountToScVal = (account) => new Address(account).toScVal();

// const stringToScValString = (value) => nativeToScVal(value);

// const numberToU64 = (value) => nativeToScVal(value, { type: "u64" });

// let params = {
//   fee: BASE_FEE,
//   networkPassphrase: Networks.TESTNET,
// };


// async function signTransaction(transactionXDR, privateKey) {
//   const keypair = Keypair.fromSecret(privateKey);
//   const transaction = TransactionBuilder.fromXDR(transactionXDR, Networks.TESTNET);
//   transaction.sign(keypair);  
//   return transaction.toXDR(); 
// }


// async function contractInt(caller, functName, values) {
//   const provider = new rpc.Server(rpcUrl, { allowHttp: true });
//   const sourceAccount = await provider.getAccount(caller);
//   const contract = new Contract(contractAddress);
//   let buildTx;

//   if (values == null) {
//     buildTx = new TransactionBuilder(sourceAccount, params)
//       .addOperation(contract.call(functName))
//       .setTimeout(30)
//       .build();
//   } else if (Array.isArray(values)) {
//     buildTx = new TransactionBuilder(sourceAccount, params)
//       .addOperation(contract.call(functName, ...values))
//       .setTimeout(30)
//       .build();
//   } else {
//     buildTx = new TransactionBuilder(sourceAccount, params)
//       .addOperation(contract.call(functName, values))
//       .setTimeout(30)
//       .build();
//   }

//   let _buildTx = await provider.prepareTransaction(buildTx);
//   let prepareTx = _buildTx.toXDR(); // pre-encoding (converting it to XDR format)

//   try {
//     let signedTx = await signTransaction(prepareTx, PREDEFINED_PRIVATE_KEY);

//     let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);

//     let sendTx = await provider.sendTransaction(tx).catch(function (err) {
//       console.error("Catch-1", err);
//       return err;
//     });

//     if (sendTx.errorResult) {
//       throw new Error("Unable to submit transaction");
//     }

//     if (sendTx.status === "PENDING") {
//       let txResponse = await provider.getTransaction(sendTx.hash);
//       while (txResponse.status === "NOT_FOUND") {
//         txResponse = await provider.getTransaction(sendTx.hash);
//         await new Promise((resolve) => setTimeout(resolve, 100));
//       }

//       if (txResponse.status === "SUCCESS") {
        
//         console.log("Full transaction response:", txResponse);
        
       
//         let result = txResponse.returnValue;


//         console.log("Raw result from contract:", result);


//         return result;
//       }
//     }
//   } catch (err) {
//     console.log("Catch-2", err);
//     return;
//   }
// }


// app.use(json());


// function getCaller(req) {
//   const callerFromHeader = req.headers['authorization']?.split(' ')[1];  
//   const callerFromQuery = req.query.caller;
//   return callerFromHeader || callerFromQuery || DEFAULT_CALLER;
// }


// app.post('/products', async (req, res) => {
//   const { name, description, price } = req.body;
//   const caller = getCaller(req); 

//   if (!name || !description || price == null) {
//     return res.status(400).send("Missing required parameters");
//   }

//   let nameScVal = stringToScValString(name);
//   let descriptionScVal = stringToScValString(description);
//   let priceScVal = numberToU64(price);

//   try {
//     let result = await contractInt(caller, "create_product", [nameScVal, descriptionScVal, priceScVal]);
//     console.log("Result is ", result)
//     if (result) {
//       return res.json({ productId: result });
//     } else {
//       return res.status(500).send("No product ID returned");
//     }
//   } catch (error) {
//     res.status(500).send("Error creating product: " + error.message);
//   }
// });

// function parseResponse(response) {
//   // Assuming the response has productId stored as ScVal
//   return scValToNative(response.productId);
// }


// app.get('/products/:id', async (req, res) => {
//   const productId = req.params.id;
//   const caller = getCaller(req); // Get caller automatically

//   if (!productId) {
//     return res.status(400).send("Missing required parameter: productId");
//   }

//   try {
//     let result = await contractInt(caller, "get_product_by_id", [numberToU64(productId)]);
//     res.json(result);
//   } catch (error) {
//     res.status(500).send("Error retrieving product: " + error.message);
//   }
// });


// app.put('/products/:id', async (req, res) => {
//   const productId = req.params.id;
//   const { name, description, price } = req.body;
//   const caller = getCaller(req); 

//   if (!productId) {
//     return res.status(400).send("Missing required parameter: productId");
//   }

//   let newNameScVal = name ? stringToScValString(name) : null;
//   let newDescriptionScVal = description ? stringToScValString(description) : null;
//   let newPriceScVal = price != null ? numberToU64(price) : null;

//   try {
//     await contractInt(caller, "update_product", [
//       numberToU64(productId),
//       newNameScVal,
//       newDescriptionScVal,
//       newPriceScVal,
//     ]);
//     res.send("Product updated successfully.");
//   } catch (error) {
//     res.status(500).send("Error updating product: " + error.message);
//   }
// });


// app.delete('/products/:id', async (req, res) => {
//   const productId = req.params.id;
//   const caller = getCaller(req); // Get caller automatically

//   if (!productId) {
//     return res.status(400).send("Missing required parameter: productId");
//   }

//   try {
//     await contractInt(caller, "delete_product", [numberToU64(productId)]);
//     res.send("Product deleted successfully.");
//   } catch (error) {
//     res.status(500).send("Error deleting product: " + error.message);
//   }
// });

// // Get all products
// app.get('/products', async (req, res) => {
//   const caller = getCaller(req); // Get caller automatically

//   try {
//     let result = await contractInt(caller, "get_all_products", null);
//     res.json(result);
//   } catch (error) {
//     res.status(500).send("Error fetching products: " + error.message);
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`API server running at http://localhost:${port}`);
// });
