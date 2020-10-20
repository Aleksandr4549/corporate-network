import express from 'express';

import cloudinary from '../core/cloudinary';
import FileModel from '../models/FileModel';
import {File, FileDocument} from '../models/FileModel';
import '../core/db';

class FileController {
  create = (req: any, res: express.Response): void => {
    const userId: string = req.user._id;
    const file: any = req.file;
    cloudinary.v2.uploader
      .upload_stream(
        { resource_type: "auto" },
        (
          error: cloudinary.UploadApiErrorResponse | undefined,
          result: cloudinary.UploadApiResponse | undefined
        ) => {
          if (error || !result) {
            return res.status(500).json({
              status: "error",
              message: error || "upload error",
            });
          }

          const fileData: Pick<
            cloudinary.UploadApiResponse,
            "filename" | "size" | "ext" | "url" | "user"
          > = {
            filename: result.original_filename,
            size: result.bytes,
            ext: result.format,
            url: result.url,
            user: userId,
          };

          const uploadFile: FileDocument = new FileModel(fileData);

          uploadFile
            .save()
            .then((fileObj: File) => {
              res.json({
                status: "success",
                file: fileObj,
              });
            })
            .catch((err: any) => {
              res.json({
                status: "error",
                message: err,
              });
            });
        }
      )
      .end(file.buffer);
  };

  delete = (req: any, res: express.Response): void => {
    const fileId: string = req.user._id;
    FileModel.deleteOne({ _id: fileId }, function (err: any) {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err,
        });
      }
      res.json({
        status: "success",
      });
    });
  };
}

export default new FileController();