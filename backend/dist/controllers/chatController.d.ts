declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: {
                role?: string;
                [key: string]: any;
            };
        }
    }
}
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=chatController.d.ts.map