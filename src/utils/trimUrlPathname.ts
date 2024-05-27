export function trimUrlPathname(path: string) {
    if (path.slice(-1) === '/') {
        return path.slice(0, -1);
    } else return path;
}
