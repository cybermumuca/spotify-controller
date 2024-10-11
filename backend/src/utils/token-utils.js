import {promises as fs} from 'node:fs';
import path from 'node:path';

const tokensFile = path.resolve('tokens.json');

export async function saveTokens({refreshToken, accessToken}) {
  await fs.writeFile(tokensFile, JSON.stringify({refreshToken, accessToken}, null, 2));
}

export async function getTokens() {
  try {
    const fileExists = await fs.stat(tokensFile);

    if (fileExists) {
      const data = await fs.readFile(tokensFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    return null;
  }
}

export async function removeTokens() {
  try {
    await fs.rmdir(tokensFile);
  } catch {
  }
}
