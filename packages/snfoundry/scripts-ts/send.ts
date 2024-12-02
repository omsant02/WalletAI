import { Account, RpcProvider, Contract, uint256, CallData } from "starknet";

// Your wallet details (from deployment)
const WALLET_ADDRESS = "0x02ad7edadcf0bf9c8e78a70257de27e0ee45b5c911462fbb90f2f26fa07122b3";
const PRIVATE_KEY = "0x3f35bf512b13ea0113d44e7eea00aa8b686e316650d4363452e77006141cbdd";
const ETH_CONTRACT = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"; // Sepolia ETH

async function sendETH(toAddress: string, amount: string) {
    const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io" });
    const account = new Account(provider, WALLET_ADDRESS, PRIVATE_KEY);

    console.log(`Sending ${amount} ETH to ${toAddress}...`);

    try {
        // Convert amount to uint256
        const amountUint256 = uint256.bnToUint256(amount);

        // Prepare calldata
        const calldata = CallData.compile({
            to: toAddress,
            amount: amountUint256
        });

        const tx = await account.execute({
            contractAddress: ETH_CONTRACT,
            entrypoint: "transfer",
            calldata: [toAddress, amountUint256.low, amountUint256.high]
        });

        console.log("Transaction sent! Hash:", tx.transaction_hash);
        console.log("Waiting for confirmation...");
        await provider.waitForTransaction(tx.transaction_hash);
        console.log("Transfer complete!");
    } catch (error) {
        console.error("Transfer failed:", error);
    }
}

// Get arguments from command line
const toAddress = process.argv[2];
const amount = process.argv[3];

if (!toAddress || !amount) {
    console.log("Usage: npx ts-node packages/snfoundry/scripts-ts/send.ts <recipient-address> <amount-in-wei>");
    process.exit(1);
}

sendETH(toAddress, amount)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });