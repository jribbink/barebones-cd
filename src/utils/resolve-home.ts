import path from 'path';

export function resolveHome(filepath: string) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME!!, filepath.slice(1));
    }
    return filepath;
}