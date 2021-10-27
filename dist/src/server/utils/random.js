"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomStringNumeric = void 0;
/**
 * Create a random numeric string
 * @param  {number} length - string length
 * @returns {string}
 */
// eslint-disable-next-line import/prefer-default-export
function randomStringNumeric(length) {
    let multiplier = 1;
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < length; i++)
        multiplier *= 10;
    return (Math.floor(Math.random() * 9 * multiplier) + multiplier).toString();
}
exports.randomStringNumeric = randomStringNumeric;
//# sourceMappingURL=random.js.map