import 'express-session'; // Dependency of nestjs-session

declare module 'express-session' {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface SessionData {
        user?: string;
    }
}
