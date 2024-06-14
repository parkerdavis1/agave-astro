export function getContrastingColor(color) {
    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    const rgbRegex =
        /^rgb\(\s*([0-9]{1,3}),\s*([0-9]{1,3}),\s*([0-9]{1,3})\s*\)$/;

    let r, g, b;
    if (hexRegex.test(color)) {
        // Get the RGB components of the text color
        [r, g, b] = hexToRgb(color);
    } else if (rgbRegex.test(color)) {
        [r, g, b] = color.match(/\d+/g);
    }

    // Calculate the relative luminance of the text color
    const luminance = calculateLuminance(r, g, b);

    // Convert the hexadecimal color to RGB
    function hexToRgb(hex) {
        return hex.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16));
    }

    // Calculate the relative luminance of a color
    function calculateLuminance(r, g, b) {
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }

    // Decide on the contrasting color
    return luminance > 0.5 ? '#202b38' : '#ffffff';
}

// export function getContrastingColor(textColor) {
//     const hexToRgb = (hex) =>
//         hex.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16)) || [];

//     const calculateLuminance = (r, g, b) =>
//         (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

//     const [r, g, b] = hexToRgb(textColor);
//     const luminance = calculateLuminance(r, g, b);

//     return luminance > 0.5 ? '#202b38' : '#ffffff';
// }

// export function getContrastingColor(textColor: string): string {
//     const hexToRgb = (hex: string): number[] =>
//         hex.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16)) || [];

//     const calculateLuminance = (r: number, g: number, b: number): number =>
//         (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

//     const [r, g, b] = hexToRgb(textColor);
//     const luminance = calculateLuminance(r, g, b);

//     return luminance > 0.5 ? '#202b38' : '#ffffff';
// }
