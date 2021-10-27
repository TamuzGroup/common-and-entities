import { Request, Response } from "express-serve-static-core";
import { NextFunction } from "express";
declare const healthCheckMiddleware: {
    isHealthCheckAuthorized: (req: Request, res: Response, next: NextFunction) => void;
};
export default healthCheckMiddleware;
//# sourceMappingURL=healthCheck.d.ts.map