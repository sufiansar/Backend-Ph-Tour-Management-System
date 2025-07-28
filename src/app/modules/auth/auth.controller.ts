import { NextFunction, Request, Response } from "express";
import { catchAsycn } from "../../utility/catchAsync";

import { sendResponse } from "../../utility/sendResponce";
import httpStatus, { StatusCodes } from "http-status-codes";

import { setAuthCookie } from "../../utility/setAuthCookie";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { createUserToken } from "../../utility/user.tokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialsLogin = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body);

    passport.authenticate(
      "local",
      { session: false },
      async (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(
            new AppError(
              httpStatus.UNAUTHORIZED,
              info.message || "Login Failed",
              ""
            )
          );
        }
        const userTokens = createUserToken(user);

        // res.cookie("accessToken", loginInfo.accessToken, {
        //     httpOnly: true,
        //     secure: false
        // })

        // res.cookie("refreshToken", loginInfo.refreshToken, {
        //     httpOnly: true,
        //     secure: false,
        // })
        const { password: pass, ...rest } = user.toObject();

        setAuthCookie(res, userTokens);

        sendResponse(res, {
          success: true,
          successCode: httpStatus.OK,
          message: "User Logged In Successfully",
          data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest,
          },
        });
      }
    )(req, res, next);
  }
);
const getNewAccessToken = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token recieved from cookies",
        ""
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      successCode: httpStatus.OK,
      message: "New Access Token Retrived Successfully",
      data: tokenInfo,
    });
  }
);

const logOut = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      successCode: httpStatus.OK,
      message: "User Loged Out Succesfully",
      data: null,
    });
  }
);

const resetPassword = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);
    sendResponse(res, {
      success: true,
      successCode: httpStatus.OK,
      message: "Password Change  Succesfully",
      data: null,
    });
  }
);

const setPassword = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;

    await AuthServices.setPassword(decodedToken.userId, password);
    sendResponse(res, {
      success: true,
      successCode: httpStatus.OK,
      message: "Password Change  Succesfully",
      data: null,
    });
  }
);

const forgotPassword = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await AuthServices.forgotPassword(email);
    sendResponse(res, {
      success: true,
      successCode: httpStatus.OK,
      message: "Email Sent Succesfully",
      data: null,
    });
  }
);
const changePassword = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    console.log(newPassword);
    await AuthServices.changePassword(
      decodedToken as JwtPayload,
      newPassword,
      oldPassword
    );
    sendResponse(res, {
      success: true,
      successCode: httpStatus.OK,
      message: "Password Change  Succesfully",
      data: null,
    });
  }
);

const googleCallbackController = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User NOt Found", "");
    }
    const tokenInfo = createUserToken(user);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logOut,
  resetPassword,
  setPassword,
  changePassword,
  forgotPassword,
  googleCallbackController,
};
