const crypto = require('crypto');

require("dotenv").config();

const algorithm = 'aes-256-cbc';
// Use the same key and IV as in frontend
const keyString = process.env.KEYSTRING; // Key string
const key = Buffer.from(keyString.padEnd(32, ' '), 'utf8').slice(0, 32); // Pad/truncate to 32 bytes
const ivString = process.env.IVSTRING; // IV string
const iv = Buffer.from(ivString.padEnd(16, ' '), 'utf8').slice(0, 16); // Pad/truncate to 16 bytes
const encrypt = async (text) => {
    text = JSON.stringify(text);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}
module.exports = {
    encrypt
}