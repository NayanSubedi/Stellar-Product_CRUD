async function invokeFunction(functionName, parameters) {
  const StellarSdk = await import('@stellar/stellar-sdk');
  const config = require("../../config/sorobanConfig");

  const server = new StellarSdk.Server(config.RPC_URL);
  const keypair = StellarSdk.Keypair.fromSecret(process.env.SOROBAN_SECRET);

  const account = await server.loadAccount(keypair.publicKey());
  const operation = StellarSdk.Operation.invokeContract({
    function: functionName,
    parameters: parameters,
    contract: config.CONTRACT_ID,
  });

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: config.NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(180)
    .build();

  transaction.sign(keypair);

  return await server.submitTransaction(transaction);
}

module.exports = { invokeFunction };
