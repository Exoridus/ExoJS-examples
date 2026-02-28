import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const targetPath = path.resolve(projectRoot, 'public', 'vendor', 'exo.bundle.js');

const sourcePath = process.env.EXOJS_BUNDLE_PATH
    ? path.resolve(projectRoot, process.env.EXOJS_BUNDLE_PATH)
    : path.resolve(projectRoot, '..', 'ExoJS', 'dist', 'exo.bundle.js');

const copyVendor = () => {
    if (!fs.existsSync(sourcePath)) {
        if (fs.existsSync(targetPath)) {
            console.log(`[vendor:sync] Source bundle not found at ${sourcePath}. Keeping existing ${targetPath}.`);
            return;
        }

        throw new Error(
            `[vendor:sync] Missing source bundle at ${sourcePath} and no existing vendor file at ${targetPath}.`
        );
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);

    const sourceStat = fs.statSync(sourcePath);
    console.log(
        `[vendor:sync] Copied ${sourcePath} -> ${targetPath} (${sourceStat.size} bytes, ${sourceStat.mtime.toISOString()})`
    );
};

copyVendor();
