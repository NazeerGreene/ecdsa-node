import { sign, etc } from '@noble/secp256k1';
import { createHmac } from 'crypto'; 
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";

// used to create and sign a transaction to be sent to the blockchain/server

// ✅ Set HMAC-SHA256 implementation (needed for signing)
etc.hmacSha256Sync = (key, ...msgs) => {
    const hmac = createHmac('sha256', key);
    for (const msg of msgs) hmac.update(msg);
    return Uint8Array.from(hmac.digest());
};

// hash the message
function hashMessage(jsonMessage) {
    const stringified = JSON.stringify(jsonMessage);
    const bytes = utf8ToBytes(stringified);
    const hash = sha256(bytes);
    return hash;
};

// sign the message
function signMessage(messageHash) {
    const signature = sign(messageHash, senderPrivateKey);
    return signature;
};

// initialize

const senderPrivateKey = 'cfaf56e3b647b83af8ab7c6902f54eecf98f9c037c836a56ea5db1e04a5c337f';
const recipientPublicAddress = '04cc38ebfd72cea1c801400215cde6226eb86b63328e684216cc7e8dae9530d23733e9cc1cfb2cd3aa9e3d1f534a689833ccd74a59251f70cb7f9891e3b31d4257';
const amount = 10;

const transaction = {
    to: recipientPublicAddress,
    amount
}

const transactionHash = hashMessage(transaction);
const signature = signMessage(transactionHash);
const recovery = signature.recovery;


const message = {
    transaction,
    signature: `${signature.toCompactHex()}+${recovery}`
}

console.log('TO SERVER\n%o', message);