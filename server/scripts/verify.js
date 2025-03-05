import { verify, Signature } from '@noble/secp256k1';
import { utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";


// hash the message
function hashMessage(jsonMessage) {
    const stringified = JSON.stringify(jsonMessage);
    const bytes = utf8ToBytes(stringified);
    const hash = sha256(bytes);
    return hash;
}

// received
const received = {
    message: {
      to: '04500e365dc11b2e1337ba38c4fe709bb26284f57931a4e2f2d92bf625e384f3948cd2fc8058f8725660a0e8d65bf4eaa8486066aa7bb63114520a448071e93af7',
      amount: 50
    },
    signature: 'd5594e93b873905cd1f2f27c1313212998cba57f89fbb4fef1ecf5707654b7f74a5c6728d89c0708c3abda42158a830ab08626a80045244e3307e75257b1a671',
    recovery: 1
};

// verify

const messageHash = hashMessage(received.message);
const signature = Signature.fromCompact(hexToBytes(received.signature)).addRecoveryBit(received.recovery);



const pubKey = signature.recoverPublicKey(messageHash);

const isValid = verify(signature, messageHash, pubKey);

console.log("Message is valid: ", isValid);

console.log("Sender public key: ", pubKey.toHex(false));