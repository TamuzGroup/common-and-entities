/**
 * Create a random numeric string
 * @param  {number} length - string length
 * @returns {string}
 */
// eslint-disable-next-line import/prefer-default-export
export function randomStringNumeric(length: number) {
  let multiplier = 1;
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < length; i++) multiplier *= 10;
  return (Math.floor(Math.random() * 9 * multiplier) + multiplier).toString();
}
