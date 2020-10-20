import express from "express";

import verifyJWT from "../utils/verifyJWT";
import {DecodedData} from "../utils/verifyJWT";

export default (
  req: any,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (
    req.path === "/login" ||
    req.path === "/signup" ||
    req.path === "/user/verify"
  ) {
    next();
  }

  const token: string | null =
    "token" in req.headers ? (req.headers.token as string) : null;

  if (token) {
    verifyJWT(token)
      .then((user: DecodedData | null) => {
        if (user) {
          req.user = user.data._doc;
        }
        next();
      })
      .catch(() => {
        res.status(403).json({ message: "Invalid auth token provided." });
      });
  }
};