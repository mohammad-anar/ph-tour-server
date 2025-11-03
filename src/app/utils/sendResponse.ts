import { Response } from "express";

interface IMeta {
  total: number;
}

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IMeta;
}
const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    status: data.statusCode,
    message: data.message,
    meta: data?.meta,
    data: data?.data,
  });
};

export default sendResponse;
