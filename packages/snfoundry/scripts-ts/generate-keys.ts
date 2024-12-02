import { stark, ec } from "starknet";
import * as fs from "fs";
import path from "path";

const generateWalletKeys = () => {
    // Generate private key
    const privateKey = stark.randomAddress();
    // Get public key from private key
    const publicKey = ec.starkCurve.getStarkKey(privateKey);

    // Save to env file
    const envContent = `
# Wallet Keys
WALLET_PRIVATE_KEY=${privateKey}
WALLET_PUBLIC_KEY=${publicKey}`;

    fs.appendFileSync(path.join(process.cwd(), '.env'), envContent);
    console.log("Keys generated and saved to .env");
    console.log("Public Key:", publicKey);
    console.log("Private Key (Keep this safe!):", privateKey);
};

generateWalletKeys();