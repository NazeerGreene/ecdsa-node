import { useState } from "react";
import server from "./server";

// import { sign, etc } from '@noble/secp256k1';
// import { createHmac } from 'crypto'; 
// import { utf8ToBytes } from "ethereum-cryptography/utils";
// import { sha256 } from "ethereum-cryptography/sha256";

// ✅ Set HMAC-SHA256 implementation (needed for signing)
// etc.hmacSha256Sync = (key, ...msgs) => {
//   const hmac = createHmac('sha256', key);
//   for (const msg of msgs) hmac.update(msg);
//   return Uint8Array.from(hmac.digest());
// };

// function hashMessage(jsonMessage) {
//   const stringified = JSON.stringify(jsonMessage);
//   const bytes = utf8ToBytes(stringified);
//   const hash = sha256(bytes);
//   return hash;
// };

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signatureInput, setSignatureInput] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // Input validation
    if (!sendAmount || isNaN(sendAmount) || parseInt(sendAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!recipient) {
      alert("Please enter a valid recipient address.");
      return;
    }

    if (!signatureInput || !signatureInput.includes('+')) {
      alert("Please enter a valid signature with recovery bit (e.g., 123+1).");
      return;
    }


    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        transaction: {
          to: recipient,
          amount: parseInt(sendAmount),
        },
        signatureInput
      });

      setBalance(balance);
    } catch (ex) {
      const errorMessage = ex.response?.data?.message || "An unexpected error occurred.";
      alert(errorMessage);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Enter signature & recovery bit, for example: 123+1"
          value={signatureInput}
          onChange={setValue(setSignatureInput)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;