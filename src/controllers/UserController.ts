import express from "express";
import bcrypt from "bcrypt";

import {UserModel, User} from "../models/UserModel";
import {validationResult, Result, ValidationError} from "express-validator";
import '../core/db';
import createJWToken from '../utils/createJWT';

class UsersController {
  index = async (_: express.Request, res: express.Response): Promise<void> => {
    try {
      const users = await UserModel.find({}).exec();

      res.json({
        status: "success",
        data: users 
      });
    } catch (error) {
      res.send({
        status: "fail",
        message: JSON.stringify(error)
      });
    }
  }

  signup = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
      }

      const data = {
        email: req.body.email, 
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
      };

      const user = await UserModel.create(data);

      user.save();

      res.send({status: 'success', data: user});
    } catch (error) {

    }
  }

  show = (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;

    UserModel.findOne({_id: id}, (err, user) => {
      if (err) {
        return res.status(404).json({
          message: "user not found"
        });
      }

      res.json(user);
    });
  }

  delete = async (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;

    const user = await UserModel.findByIdAndRemove({_id: id});

    if(user) {
      res.json({
        message: `user ${user.fullname} delete`
      })
    } else {
      res.status(404).json({
        status: "error"
      })
    }
  }

  login = (req: express.Request, res: express.Response): void => {
    const data: { email: string; password: string } = {
      email: req.body.email,
      password: req.body.password,
    };

    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      UserModel.findOne({ email: data.email }, (err, user: User) => {
        if (err || !user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        if (bcrypt.compareSync(data.password, user.password)) {
          const token = createJWToken(user);
          res.json({
            status: "success",
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            username: user.username,
            token
          });
        } else {
          res.status(403).json({
            status: "error",
            message: "Incorrect password or email"
          });
        }
      });
    }
  }

  getMe = (req: any, res: express.Response): void => {
    const id: string = req.user && req.user._id;

    UserModel.findById(id, (err: any, user: User) => {
      if (err || !user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.json(user);
    });
  }
}

export default new UsersController();