/**
 * Create an object composed of the picked object properties
 * @param  {T extends Record<string, any>} obj
 * @param  {K extends Extract<keyof T, string>} keys
 * @returns {Partial<Pick<T, K>>}
 */
declare const pick: <T extends Record<string, any>, K extends Extract<keyof T, string>>(obj: T, keys: readonly K[]) => Partial<Pick<T, K>>;
export default pick;
//# sourceMappingURL=pick.d.ts.map