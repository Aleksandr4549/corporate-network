declare namespace Express {
  import {UserInterface} from "./models/UserModel";

  export interface Request {
    user?: UserInterface;
  }
}
