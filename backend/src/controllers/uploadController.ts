import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

export class UploadController {
  public uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return sendError(res, 'No file uploaded.', 400);
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      return sendSuccess(
        res,
        {
          url: fileUrl,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
        'File uploaded successfully!',
        201
      );
    } catch (err) {
      next(err);
    }
  }
}

export const uploadController = new UploadController();
