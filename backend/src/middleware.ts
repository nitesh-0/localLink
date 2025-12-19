import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";


declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role: string | undefined;
    }
  }
}



export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  console.log("reached middleware")
  

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({ 
        msg: "auth header missing"
     });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ 
      msg: "token missing"
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string; userRole?: string };

    req.userId = decoded.userId; // ✅ Now TypeScript knows this exists
    req.role = decoded.userRole;

    next();
  } 

  catch (e) {
    res.status(403).json({
      msg: "middleware failure",
      error: e,
    });
  }

};