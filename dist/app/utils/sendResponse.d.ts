import { Response } from "express";
interface IMeta {
    page?: number;
    limit?: number;
    totalPage?: number;
    total?: number;
}
interface IResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: IMeta;
}
declare const sendResponse: <T>(res: Response, data: IResponse<T>) => void;
export default sendResponse;
//# sourceMappingURL=sendResponse.d.ts.map