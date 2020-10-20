import mongoose, { Schema, Document } from 'mongoose';
import { User } from './UserModel';
import { Message } from './MessageModel';

export interface File {
  filename: string;
  size: number;
  ext: string;
  url: string;
  message: Message | string;
  user: User | string;
}

export type FileDocument = Document & File;

const FileSchema = new Schema(
  {
    filename: String,
    size: Number,
    ext: String,
    url: String,
    message: { type: Schema.Types.ObjectId, ref: "WorkingMessage", require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model<FileDocument>(
  "FileModel",
  FileSchema
);

export default FileModel;