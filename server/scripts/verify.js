import { sign, etc, verify, Signature } from '@noble/secp256k1';
import { createHmac, hash } from 'crypto'; 
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
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
      from: '04adc20f3c89775289d6d87b495fe8f5f5206d81f9dda2f45c1bb7782c1bc894a97d9650f27aa1922e69fffada14fa888a874305e282c09c8ebea72df1fdf0443b',
      to: '04500e365dc11b2e1337ba38c4fe709bb26284f57931a4e2f2d92bf625e384f3948cd2fc8058f8725660a0e8d65bf4eaa8486066aa7bb63114520a448071e93af7',
      amount: 50
    },
    signature: {
      r: 9411049478829602566571699285751736446746076947286793816509051703469320062705n,
      s: 21848311561810395132890180538746262263263927446097629740517032409444823846351n,
      recovery: 0
    }
};


// verify

const messageHash = hashMessage(received.message);
const signature = new Signature(received.signature.r, received.signature.s, received.signature.recovery);

const pubKey = signature.recoverPublicKey(messageHash);

const isValid = verify(signature, messageHash, pubKey);

console.log("Message is valid: ", isValid);

console.log("Sender public key: ", pubKey.toHex(false));