import { sign, etc } from '@noble/secp256k1';
import { createHmac, hash } from 'crypto'; 
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";


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

const senderPrivateKey = '6af12b1114892784fe3c51b3859daf31fd2eefc06429df995679f7928368deca';
const senderPublicKey = '04adc20f3c89775289d6d87b495fe8f5f5206d81f9dda2f45c1bb7782c1bc894a97d9650f27aa1922e69fffada14fa888a874305e282c09c8ebea72df1fdf0443b';
const recipientPublicAddress = '04500e365dc11b2e1337ba38c4fe709bb26284f57931a4e2f2d92bf625e384f3948cd2fc8058f8725660a0e8d65bf4eaa8486066aa7bb63114520a448071e93af7';
const amount = 50;

const message = {
    from: senderPublicKey,
    to: recipientPublicAddress,
    amount
}

const messageHash = hashMessage(message);

const signature = signMessage(messageHash);

const mail = {
    message,
    signature: {
        r: signature.r,
        s: signature.s,
        recovery: signature.recovery
    }
}

console.log('TO SERVER\n%o', mail);