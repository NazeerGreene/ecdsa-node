import express from "express";
import cors from "cors";
import { verify, Signature } from "@noble/secp256k1";
import { utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04dfb100d886c2c126922a8c393eb90e431c4195b59a1b4b71b256e46b8b2a6ee4ed920dd9a56ca3b3b8342c9811ac673fd5751f7eadddfb491e8da95573e7a9f3": 100,
  "04cc38ebfd72cea1c801400215cde6226eb86b63328e684216cc7e8dae9530d23733e9cc1cfb2cd3aa9e3d1f534a689833ccd74a59251f70cb7f9891e3b31d4257": 50,
  "040e2dfa5eece72f6911fac7af30b9a6edec6a26a707b0a440747999864a4bdedade9883abf2bef999cf5518ea2d323582e19d129ee390672c3770a4e03af55a11": 75,
};

function hashMessage(jsonMessage) {
  const stringified = JSON.stringify(jsonMessage);
  const bytes = utf8ToBytes(stringified);
  const hash = sha256(bytes);
  return hash;
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction, signatureInput } = req.body;
  console.log('-'.repeat(100));
  console.log(req.body);

  const [sig, bit] = signatureInput.split('+');
  const recovery = Number(bit);
  const sigObj = Signature.fromCompact(hexToBytes(sig)).addRecoveryBit(recovery);

  const transactionHash = hashMessage(transaction);
  const senderPubKey = sigObj.recoverPublicKey(transactionHash);
  const recipient = transaction.to;

  const isValid = verify(sigObj, transactionHash, senderPubKey);

  if (!isValid) {
    res.status(400).send({ message: "Invalid signature!" });
    return;
  }

  const sender = senderPubKey.toHex(false);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const amount = transaction.amount;
  console.log(`
  Sender: ${sender}
  Recipient: ${recipient}`);
  console.log(balances);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
