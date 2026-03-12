import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.resolve(projectRoot, 'node_modules', 'monaco-editor', 'min', 'vs');
const targetDir = path.resolve(projectRoot, 'public', 'vendor', 'monaco', 'vs');

const syncMonacoVendor = () => {
    if (!fs.existsSync(sourceDir)) {
        throw new Error(`[vendor:sync] Missing Monaco assets at ${sourceDir}. Install dependencies first.`);
    }

    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(targetDir), { recursive: true });
    fs.cpSync(sourceDir, targetDir, { recursive: true });

    console.log(`[vendor:sync] Copied Monaco assets from ${sourceDir} -> ${targetDir}`);
};

syncMonacoVendor();
