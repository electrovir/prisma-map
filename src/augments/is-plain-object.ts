import type {AnyObject} from '@augment-vir/common';

/**
 * Detects when an object is a _plain_ object (like `{key: 'value'}`) only, excluding everything
 * else that has a `typeof` result of `'object'` (everything that's not a primitive).
 *
 * This is used in `mapPrismaValues` to detect when
 *
 * @category Internal
 * @example
 *
 * ```ts
 * isPlainObject({}); // true
 * isPlainObject({value: 'key'}); // true
 * isPlainObject(null); // false
 * isPlainObject(new RegExp()); // false
 * isPlainObject(new Date()); // false
 * ```
 */
export function isPlainObject(value: unknown): value is AnyObject {
    if (typeof value !== 'object' || value == undefined) {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return (
        (prototype == undefined ||
            prototype === Object.prototype ||
            Object.getPrototypeOf(prototype) == undefined) &&
        !(Symbol.toStringTag in value) &&
        !(Symbol.iterator in value)
    );
}
