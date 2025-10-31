
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import prisma from '../lib/prisma.ts';

// --- Encryption/Decryption Helpers ---
const algorithm = 'aes-256-gcm';
const key = scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32); // Use a salt for the key derivation

const encrypt = (text: string) => {
  const iv = randomBytes(16); // Initialization vector
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Return all parts needed for decryption
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
    authTag: authTag.toString('hex'),
  };
};

const decrypt = (hash: { iv: string, content: string, authTag: string }) => {
  const decipher = createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(hash.authTag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrypted.toString();
};

// --- Service Functions ---

// Service to CREATE a new, encrypted credential
export const createCredential = async (name: string, type: string, data: object, userId: string) => {
  // Encrypt the sensitive data object
  const encryptedData = encrypt(JSON.stringify(data));

  return prisma.credentials.create({
    data: {
      name,
      type,
      authorId: userId,
      data: encryptedData as any, // Store the encrypted hash object
    },
  });
};

// Service to GET ALL credentials for a user (WITHOUT exposing secret data)
export const getCredentialsForUser = async (userId: string) => {
  return prisma.credentials.findMany({
    where: {
      authorId: userId,
    },
    // CRITICAL: Select only the safe fields to return to the frontend
    select: {
      id: true,
      name: true,
      type: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Service to DELETE a credential, ensuring ownership
export const deleteCredential = async (credentialId: string, userId: string) => {
  const result = await prisma.credentials.deleteMany({
    where: {
      id: credentialId,
      authorId: userId, // Security check
    },
  });

  if (result.count === 0) {
    throw new Error("Credential not found or user does not have permission.");
  }
  return { success: true };
};

// INTERNAL-ONLY Service for the WORKER to get and decrypt credentials
export const getAndDecryptCredential = async (credentialId: string, userId: string): Promise<object | null> => {
    const credential = await prisma.credentials.findFirst({
        where: {
            id: credentialId,
            authorId: userId,
        }
    });

    if (!credential || !credential.data) {
        return null;
    }

    const decryptedDataString = decrypt(credential.data as any);
    return JSON.parse(decryptedDataString);
}