import { trimUrlPathname } from './trimUrlPathname';
import { describe, expect, test } from 'vitest';

describe('trimUrlPathname works', () => {
    test('trailing slash gets trimmed', () => {
        const trimmed = trimUrlPathname('/blog/quail/');
        expect(trimmed).toBe('/blog/quail');
    });
    test("no trailing slash doesn't trim", () => {
        const notTrimmed = trimUrlPathname('/blog/quail');
        expect(notTrimmed).toBe('/blog/quail');
    });
});
