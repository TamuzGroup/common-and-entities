"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create an object composed of the picked object properties
 * @param  {T extends Record<string, any>} obj
 * @param  {K extends Extract<keyof T, string>} keys
 * @returns {Partial<Pick<T, K>>}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pick = (obj, keys) => {
    return keys.reduce((accumulator, key) => {
        if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
            accumulator[key] = obj[key];
        }
        return accumulator;
    }, {});
};
exports.default = pick;
//# sourceMappingURL=pick.js.map