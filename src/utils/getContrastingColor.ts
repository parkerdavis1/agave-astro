export function getContrastingColor(color: string): string {
    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    const rgbRegex =
        /^rgb\(\s*([0-9]{1,3}),\s*([0-9]{1,3}),\s*([0-9]{1,3})\s*\)$/;

    const hexToRgb = (hex: string): number[] => {
        const hexClean = hex.replace(/^#/, '');
        const bigint = parseInt(hexClean, 16);
        if (hexClean.length === 3) {
            return [(bigint >> 8) & 0xf, (bigint >> 4) & 0xf, bigint & 0xf].map(
                (v) => v * 17,
            );
        } else if (hexClean.length === 6) {
            return [(bigint >> 16) & 0xff, (bigint >> 8) & 0xff, bigint & 0xff];
        }
        throw new Error('Invalid HEX color format');
    };

    const calculateLuminance = (r: number, g: number, b: number): number =>
        (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    let r, g, b;

    if (hexRegex.test(color)) {
        [r, g, b] = hexToRgb(color);
    } else if (rgbRegex.test(color)) {
        const [, red, green, blue] = color.match(rgbRegex)?.map(Number) || [];
        r = red;
        g = green;
        b = blue;
    } else {
        throw new Error('Invalid color format. Use HEX or RGB.');
    }

    const luminance = calculateLuminance(r, g, b);
    return luminance > 0.5 ? '#202b38' : '#ffffff';
}

export function convertColor(color: string): string | null {
    if (color.startsWith('#')) {
        // If it's already a hex color, return it directly
        return color;
    } else if (color.startsWith('rgb(')) {
        // Convert RGB to hex
        const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) {
            return null; // Invalid format
        }
        const [, rStr, gStr, bStr] = match;
        const r = parseInt(rStr, 10);
        const g = parseInt(gStr, 10);
        const b = parseInt(bStr, 10);

        const toHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return '#' + toHex(r) + toHex(g) + toHex(b);
    } else {
        return null; // Unsupported format
    }
}
