import fs from 'node:fs/promises';

export async function readConfig(path: string): Promise<any> {
  const contents = await fs.readFile(path, 'utf8');
  try {
    return JSON.parse(contents);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    console.log('error parsing config:', msg);
    process.exit(1);
  }
}

export async function readInput(path: string): Promise<any> {
  const contents = await fs.readFile(path, 'utf8');
  try {
    return JSON.parse(contents);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    console.log('error parsing input:', msg);
    process.exit(1);
  }
}

export async function readXML(path: string): Promise<string> {
  return fs.readFile(path, 'utf8');
}
