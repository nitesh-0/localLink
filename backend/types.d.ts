import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string; // optional, since it may not exist initially
  }
}
