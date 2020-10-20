import {model, Schema, Document} from 'mongoose';

export interface Message extends Document {
  author: string
  text: string
  date?: string
}

const MessageShema = new Schema({
  author: {
    type: String,
    require: true
  },
  text: {
    type: String,
    require: true
  },
  date: {
    type: String,
    require: true
  },
  attachments: [{type: String}],
}, {usePushEach: true});

export const WorkingMessageModel = model<Message>('WorkingMessage', MessageShema);
export const FloodingMessageModel = model<Message>('FloodingMessage', MessageShema);