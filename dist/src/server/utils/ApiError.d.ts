export default class ApiError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean, stack?: string);
}
//# sourceMappingURL=ApiError.d.ts.map