import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncRoute = (route: RequestHandler) : RequestHandler => (
  (req: Request, res: Response, next: NextFunction): any => (
    Promise.resolve(route(req, res, next)).catch(next)
  )
);