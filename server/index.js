const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04adc20f3c89775289d6d87b495fe8f5f5206d81f9dda2f45c1bb7782c1bc894a97d9650f27aa1922e69fffada14fa888a874305e282c09c8ebea72df1fdf0443b": 100,
  "04500e365dc11b2e1337ba38c4fe709bb26284f57931a4e2f2d92bf625e384f3948cd2fc8058f8725660a0e8d65bf4eaa8486066aa7bb63114520a448071e93af7": 50,
  "04aee5209ef6d1aa878497c9efdda4f8b8b4a3a2c5c79e3e6b398b1ec42b7ad90864ac4c48752cd82faa901cd740fa227646fe0ce27e3733c4583bae51f06072ba": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

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
