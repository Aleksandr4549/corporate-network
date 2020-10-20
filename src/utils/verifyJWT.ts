import jwt, {VerifyErrors} from "jsonwebtoken";
import {User} from "../models/UserModel";

export interface DecodedData {
  data: {
    _doc: User;
  };
}

export default (token: string): Promise<DecodedData | null> =>
  new Promise(
    (
      resolve: (decodedData: DecodedData) => void,
      reject: (err: VerifyErrors) => void
    ) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET || "",
        (err: any, decodedData) => {
          if (err || !decodedData) {
            return reject(err);
          }
          
          resolve(decodedData as DecodedData);
        }
      );
    }
  );