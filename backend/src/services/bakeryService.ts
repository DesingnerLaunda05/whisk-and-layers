import { bakeryRepository } from '../repositories/bakeryRepository.js';
import { cakeRepository } from '../repositories/cakeRepository.js';
import { reviewRepository } from '../repositories/reviewRepository.js';

export class BakeryService {
  public getAllBakeries(params: {
    search?: string;
    city?: string;
    specialty?: string;
    sortBy?: 'rating' | 'reviews' | 'name' | 'newest';
    page?: number;
    limit?: number;
  }) {
    return bakeryRepository.findAll(params);
  }

  public getBakeryByIdOrSlug(identifier: string | number) {
    const isNum = !isNaN(Number(identifier));
    const bakery = isNum
      ? bakeryRepository.findById(Number(identifier))
      : bakeryRepository.findBySlug(String(identifier));

    if (!bakery) {
      throw new Error('Bakery not found.');
    }

    // Get bakery cakes
    const cakesRes = cakeRepository.findAll({
      bakeryId: bakery.id,
      availableOnly: false,
      limit: 50,
    });

    // Get bakery reviews
    const reviewsRes = reviewRepository.findByBakery(bakery.id, { limit: 10 });

    return {
      bakery,
      cakes: cakesRes.cakes,
      reviews: reviewsRes.reviews,
    };
  }

  public getBakeryProfile(userId: number) {
    const bakery = bakeryRepository.findByUserId(userId);
    if (!bakery) {
      throw new Error('Bakery profile not found for this account.');
    }
    return bakery;
  }

  public updateBakeryProfile(userId: number, data: any) {
    const bakery = bakeryRepository.findByUserId(userId);
    if (!bakery) {
      throw new Error('Bakery profile not found.');
    }

    return bakeryRepository.update(bakery.id, data);
  }
}

export const bakeryService = new BakeryService();
