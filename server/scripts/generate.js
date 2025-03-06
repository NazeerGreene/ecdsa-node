import { toHex } from "ethereum-cryptography/utils";
import { utils, getPublicKey } from '@noble/secp256k1';

// used to generate private and public key pairs

const privateKey = utils.randomPrivateKey();
const publicKey = getPublicKey(privateKey, false);

console.log(`
Private Key: ${toHex(privateKey)}
Public Key: ${toHex(publicKey)}
`);
