import { reviewRepository } from '../repositories/reviewRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';
import { bakeryRepository } from '../repositories/bakeryRepository.js';
import { notificationRepository } from '../repositories/notificationRepository.js';

export class ReviewService {
  public async createReview(customerId: number, data: { orderId: number; rating: number; comment: string }) {
    const order = orderRepository.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.customer_id !== customerId) {
      throw new Error('You can only review orders that you placed.');
    }

    if (order.status !== 'DELIVERED') {
      throw new Error('Reviews can only be submitted for completed/delivered orders.');
    }

    const existing = reviewRepository.findByOrderId(data.orderId);
    if (existing) {
      throw new Error('You have already reviewed this order.');
    }

    const review = reviewRepository.create({
      orderId: data.orderId,
      customerId,
      bakeryId: order.bakery_id,
      rating: data.rating,
      comment: data.comment,
    });

    const bakery = bakeryRepository.findById(order.bakery_id);
    if (bakery) {
      notificationRepository.create({
        userId: bakery.user_id,
        type: 'NEW_REVIEW',
        title: `New ${data.rating}★ Review Received!`,
        message: `A customer wrote: "${data.comment.slice(0, 80)}..."`,
        linkUrl: `/bakery/reviews`,
      });
    }

    return review;
  }

  public async replyToReview(userId: number, reviewId: number, replyComment: string) {
    const review = reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Review not found.');
    }

    const bakery = bakeryRepository.findByUserId(userId);
    if (!bakery || bakery.id !== review.bakery_id) {
      throw new Error('You can only reply to reviews for your bakery.');
    }

    const updated = reviewRepository.reply(reviewId, replyComment);

    // Notify customer
    notificationRepository.create({
      userId: review.customer_id,
      type: 'REVIEW_REPLY',
      title: `${bakery.name} replied to your review!`,
      message: replyComment,
      linkUrl: `/bakeries/${bakery.slug}`,
    });

    return updated;
  }

  public getBakeryReviews(bakeryId: number, params: any) {
    return reviewRepository.findByBakery(bakeryId, params);
  }
}

export const reviewService = new ReviewService();
