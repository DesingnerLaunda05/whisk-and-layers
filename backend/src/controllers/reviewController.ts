import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/reviewService.js';
import { createReviewSchema, replyReviewSchema } from '../validators/schemas.js';
import { sendSuccess } from '../utils/response.js';

export class ReviewController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.user!.userId;
      const validated = createReviewSchema.parse(req.body);
      const review = await reviewService.createReview(customerId, validated);
      return sendSuccess(res, review, 'Thank you! Your review has been posted.', 201);
    } catch (err) {
      next(err);
    }
  }

  public async reply(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const reviewId = parseInt(req.params.id as string, 10);
      const validated = replyReviewSchema.parse(req.body);
      const updated = await reviewService.replyToReview(userId, reviewId, validated.replyComment);
      return sendSuccess(res, updated, 'Reply posted successfully!');
    } catch (err) {
      next(err);
    }
  }

  public async getBakeryReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const bakeryId = parseInt(req.params.bakeryId as string, 10);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const result = reviewService.getBakeryReviews(bakeryId, { page, limit });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export const reviewController = new ReviewController();
