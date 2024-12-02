import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";
import { stark, ec, hash, CallData } from "starknet"; // Added CallData and hash imports
import * as fs from "fs";
import path from "path";

const generateAndSaveKeys = () => {
  // Generate private key
  const privateKey = stark.randomAddress();
  // Get public key from private key
  const publicKey = ec.starkCurve.getStarkKey(privateKey);

  // Save to env file
  const envPath = path.join(process.cwd(), '.env');
  const envContent = `\nWALLET_PRIVATE_KEY=${privateKey}\nWALLET_PUBLIC_KEY=${publicKey}`;
  fs.appendFileSync(envPath, envContent);

  return { privateKey, publicKey };
};

const deployScript = async (): Promise<void> => {
  // Generate new keys
  const keys = generateAndSaveKeys();
  
  // Calculate future address using starknet.js
  const OZaccountClassHash = '0x061dac032f228abef9c6626f995015233097ae253a7f72d68552db02f2971b8f';
  const constructorCallData = CallData.compile({ publicKey: keys.publicKey });
  const futureAddress = hash.calculateContractAddressFromHash(
    keys.publicKey,
    OZaccountClassHash,
    constructorCallData,
    0
  );

  console.log(green("Generated new wallet keys:"));
  console.log("Public Key:", keys.publicKey);
  console.log("Private Key (Keep this safe!):", keys.privateKey);
  console.log("\nPre-calculated wallet address:", futureAddress);
  console.log("\nIMPORTANT: Please send some ETH to this address before continuing!");
  
  // Wait for user confirmation
  await new Promise(resolve => {
    console.log("\nPress enter once you've funded the address...");
    process.stdin.once('data', resolve);
  });

  // Now deploy with higher max fee
  await deployContract({
    contract: "CustomWallet",
    contractName: "CustomWallet",
    constructorArgs: {
      public_key: keys.publicKey,
    },
    options: {
      maxFee: BigInt(200000000000000), // Increased max fee
    }
  });
};

deployScript()
  .then(async () => {
    executeDeployCalls()
      .then(() => {
        exportDeployments();
        console.log(green("Wallet deployment complete! Next steps:"));
        console.log("1. Get your wallet address from deployments");
        console.log("2. Fund your wallet with some ETH");
        console.log("3. Your wallet is ready to use!");
      })
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  })
  .catch(console.error);