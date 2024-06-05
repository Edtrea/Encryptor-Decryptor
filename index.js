const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Do you want to encrypt or decrypt? (e/d): ", (choice) => {
  if (choice.toLocaleLowerCase().trim() === "e") {
    rl.question("Enter the message to encrypt: ", (message) => {
      const secretKey = crypto.randomBytes(32); // Generate a random secret key
      const iv = crypto.randomBytes(16); // Generate a random IV
      const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);

      let encryptedMessage = cipher.update(message, "utf8", "hex");
      encryptedMessage += cipher.final("hex");

      console.log("Encrypted Message:", encryptedMessage);
      console.log("Secret Key:", secretKey.toString("hex"));
      console.log("Initialization Vector (IV):", iv.toString("hex"));
      rl.close();
    });
  } else if (choice.toLocaleLowerCase().trim() === "d") {
    rl.question("Enter the encrypted message: ", (encryptedMessage) => {
      rl.question("Enter the secret key: ", (secretKeyHex) => {
        rl.question("Enter the initialization vector (IV): ", (ivHex) => {
          const secretKey = Buffer.from(secretKeyHex.trim(), "hex");
          const iv = Buffer.from(ivHex.trim(), "hex");

          const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            secretKey,
            iv,
          );

          let decryptedMessage = decipher.update(
            encryptedMessage.trim(),
            "hex",
            "utf8",
          );
          decryptedMessage += decipher.final("utf8");

          console.log("Decrypted Message:", decryptedMessage);
          rl.close();
        });
      });
    });
  } else {
    console.log('Invalid choice. Please enter "encrypt" or "decrypt".');
    rl.close();
  }
});
