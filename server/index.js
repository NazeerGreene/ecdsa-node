import express from "express";
import cors from "cors";
import getSenderPublicKey from "./verify.js";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04dfb100d886c2c126922a8c393eb90e431c4195b59a1b4b71b256e46b8b2a6ee4ed920dd9a56ca3b3b8342c9811ac673fd5751f7eadddfb491e8da95573e7a9f3": 100,
  "04cc38ebfd72cea1c801400215cde6226eb86b63328e684216cc7e8dae9530d23733e9cc1cfb2cd3aa9e3d1f534a689833ccd74a59251f70cb7f9891e3b31d4257": 50,
  "040e2dfa5eece72f6911fac7af30b9a6edec6a26a707b0a440747999864a4bdedade9883abf2bef999cf5518ea2d323582e19d129ee390672c3770a4e03af55a11": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction, signatureInput } = req.body;

  // debugging
  console.log('-'.repeat(100));
  console.log(req.body);

  const sender = getSenderPublicKey(transaction, signatureInput);
  const recipient = transaction.to || null;
  const amount = transaction.amount || 0;

  if (null === sender) {
    res.status(400).send({ message: "Invalid signature!" });

  } else if (!balances[sender]) {
    /*
     * due to the symmetrical nature of elliptical curves, the signature can produce a valid
     * but wrong public key, and therefore the key should be checked against known accounts.
    */
    res.status(400).send({ message: "Sender not known! Check signature." }); 

  } else if (!recipient) {
    res.status(400).send({ message: "Invalid recipient!" });

  } else {
    //setInitialBalance(sender);
    setInitialBalance(recipient);
  
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
