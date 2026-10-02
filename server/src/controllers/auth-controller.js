import { decrypt } from "../helpers/decrypt.js";
import { encrypt } from "../helpers/encrypt.js";
import { createResponse } from "../utils/common-utils.js";

export const logOut = async (req, res) => {
  try {
    console.log(req.cookies);
    if (req.cookies.auth) {
      const decryptCookie = await decrypt(req.cookies.auth);
      if (decryptCookie) {
        // if (Date.now() > decryptCookie.expiresAt) {
        res.clearCookie("auth");
        return res.json({
          statusCode: "200",
          data: null,
          message: "Loged Out Successfully!",
        });
        // }
      } else {
        throw false;
      }
    } else {
      throw false;
    }
  } catch (error) {
    res.json({
      statusCode: "500",
      data: null,
      message: "Something Went Wrong!",
    });
  }
};
export const logIn = async (req, res) => {
  try {
    const body = req.body;
    if (body.userName) {
      const COOKIE_EXPIRY_TIME =
        Number(process.env.COOKIE_EXPIRY_TIME) * 60 * 1000;
      const cookie = await encrypt({
        username: body?.userName,
        expiresAt: Date.now() + COOKIE_EXPIRY_TIME,
      });
      res.cookie("auth", cookie, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: COOKIE_EXPIRY_TIME,
      });
      res
        .status(200)
        .json(
          createResponse(
            200,
            { userName: body?.userName, sessionTimeOut: 300 },
            "Logged in Successfully!",
            "",
          ),
        );
    } else {
      throw "Username is required";
    }
  } catch (error) {
    res.status(500).json(createResponse(500, {}, error));
  }
};

export const getProfile = async (req, res) => {
  try {
    res
      .status(200)
      .json(
        createResponse(200, { userName: "Sivakarthikeyan" }, "Success", ""),
      );
  } catch (error) { }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const exit = () => {
      res
        .status(401)
        .json(
          createResponse(401, {}),
        );
    };
    const authCookie = req.cookies?.auth;

    if (!authCookie) {
      // return false;
      exit();
    }

    const decryptedCookie = await decrypt(authCookie);

    if (!decryptedCookie?.expiresAt) {
      // return false;.
      exit();
    }

    if (Date.now() > decryptedCookie.expiresAt) {
      exit()
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json(
        createResponse(401, {}),
      );
  }
};
