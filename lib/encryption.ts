import crypto from "crypto";

const ENCRYPTION_KEY: string | undefined = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error("ENCRYPTION_KEY must be 64 hex characters long (32 bytes).");
}
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypts a given text using AES-256-CBC.
 * @param {string} text - The text to encrypt.
 * @returns {string} - The encrypted text in hex format, with the IV prepended.
 */
function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not defined.");
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv,
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a given encrypted text using AES-256-CBC.
 * @param {string} text - The encrypted text in hex format, with the IV prepended.
 * @returns {string} - The decrypted text.
 */
function decrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not defined.");
  }
  const [iv, encryptedText] = text.split(":");
  const ivBuffer = Buffer.from(iv, "hex");
  const encryptedBuffer = Buffer.from(encryptedText, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    ivBuffer,
  );
  // @ts-ignore
  let decrypted = decipher.update(encryptedBuffer, "hex", "utf8");
  // @ts-ignore
  decrypted += decipher.final("utf8");
  return decrypted;
}

export { decrypt, encrypt };
