import { Response } from "express";

interface IAuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookies = (res: Response, tokenInfo: IAuthTokenInfo) => {
  // check if accessToken
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  // check if refreshToken
  if(tokenInfo.refreshToken){
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
