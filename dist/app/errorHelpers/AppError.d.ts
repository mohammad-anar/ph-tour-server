declare class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string, stack?: any);
}
export default AppError;
//# sourceMappingURL=AppError.d.ts.map