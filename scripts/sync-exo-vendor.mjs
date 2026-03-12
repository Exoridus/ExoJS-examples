import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const packageRoot = process.env.EXOJS_PACKAGE_PATH
    ? path.resolve(projectRoot, process.env.EXOJS_PACKAGE_PATH)
    : path.resolve(projectRoot, 'node_modules', 'exojs');
const sourceDistDir = path.resolve(packageRoot, 'dist');
const targetDir = path.resolve(projectRoot, 'public', 'vendor', 'exojs');

const filesToCopy = [
    'exo.esm.js',
    'exo.esm.js.map',
    'exo.d.ts',
    'webgl2.esm.js',
    'webgl2.esm.js.map',
    'webgl2.d.ts',
    'webgpu.esm.js',
    'webgpu.esm.js.map',
    'webgpu.d.ts',
];

const moduleShims = `declare module "exojs" {
    export * from "index";
}

declare module "exojs/webgl2" {
    export * from "webgl2";
}

declare module "exojs/webgpu" {
    export * from "webgpu";
}
`;

const ensureSourcePackage = () => {
    if (!fs.existsSync(sourceDistDir)) {
        throw new Error(
            `[vendor:sync] Missing ExoJS package dist at ${sourceDistDir}. Install dependencies and ensure the local exojs package is built.`
        );
    }
};

const copyVendorFiles = () => {
    ensureSourcePackage();

    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(targetDir, { recursive: true });

    for (const fileName of filesToCopy) {
        const sourcePath = path.resolve(sourceDistDir, fileName);
        const targetPath = path.resolve(targetDir, fileName);

        if (!fs.existsSync(sourcePath)) {
            throw new Error(`[vendor:sync] Missing ExoJS package file at ${sourcePath}.`);
        }

        fs.copyFileSync(sourcePath, targetPath);
    }

    fs.writeFileSync(path.resolve(targetDir, 'module-shims.d.ts'), moduleShims, 'utf8');

    console.log(
        `[vendor:sync] Copied ExoJS ESM runtime and declarations from ${sourceDistDir} -> ${targetDir}`
    );
};

copyVendorFiles();
