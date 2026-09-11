import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const pagesBase = process.env.GITHUB_ACTIONS === 'true' ? '/KitchenSim/' : '/';

export default defineConfig({
    base: pagesBase,
    server: {
        open: true,
        port: 5173
    },
    build: {
        rollupOptions: {
            input: resolve(currentDirectory, 'index.html')
        }
    },
    resolve: {
        alias: {
            '@': resolve(currentDirectory, 'src')
        }
    }
});
