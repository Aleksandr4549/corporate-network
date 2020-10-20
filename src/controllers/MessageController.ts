import express from "express";
import {WorkingMessageModel, FloodingMessageModel, Message} from "../models/MessageModel";
import {validationResult} from "express-validator";
import '../core/db';

class MessagesController {
  async index(req: express.Request, res: express.Response): Promise<void> {
    try {
      let messages: Array<Message | null>;
      if (req.originalUrl === '/working') {
        messages = await WorkingMessageModel.find({}).exec();
      } else {
        messages = await FloodingMessageModel.find({}).exec();
      }

      res.json({
        status: "success",
        data: messages
      })
    } catch (error) {
      res.send({
        status: "error",
        message: JSON.stringify(error)
      })
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty) {
        res.status(400).json({errors: errors.array()});
        return;
      }

      const data = {
        author: req.body.author,
        text: req.body.text,
        date: req.body.date,
        attachments: req.body.attachments
      }

      let message: Message | null;

      if (req.originalUrl === '/working') {
        message = await WorkingMessageModel.create(data);
      } else {
        message = await FloodingMessageModel.create(data);
      }

      message.save()

      res.send({status: 'success', data: message});
    } catch (error) {
      res.send({
        status: 'error',
        message: error
      })
    }
  }

  async delete(req: express.Request, res: express.Response) {
    const id: string = req.params.id;
    let message: Message | null;

    if (req.originalUrl === `/working/${id}`) {
      message = await WorkingMessageModel.findByIdAndRemove({_id: id});
    } else {
      message = await FloodingMessageModel.findByIdAndRemove({_id: id});
    }

    if(message) {
      res.json({
        message: `message delete`
      })
    } else {
      res.status(404).json({
        status: "error"
      })
    }
  }
}

export default new MessagesController();