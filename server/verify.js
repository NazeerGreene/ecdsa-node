import { verify, Signature } from "@noble/secp256k1";
import { utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";

function hashMessage(jsonMessage) {
    const stringified = JSON.stringify(jsonMessage);
    const bytes = utf8ToBytes(stringified);
    const hash = sha256(bytes);
    return hash;
}

function getSenderPublicKey(transaction, signatureAndRecovery) {
    // recovery signature and recovery
    const [signature, bit] = signatureAndRecovery.split('+');
    const recovery = Number(bit);
    const sigObj = Signature.fromCompact(hexToBytes(signature)).addRecoveryBit(recovery);

    // verify message signed by sender (owner)
    const transactionHash = hashMessage(transaction);
    const senderPubKey = sigObj.recoverPublicKey(transactionHash);
    const isValid = verify(sigObj, transactionHash, senderPubKey);

    return isValid ? senderPubKey.toHex(false) : null;
}

export default getSenderPublicKey;