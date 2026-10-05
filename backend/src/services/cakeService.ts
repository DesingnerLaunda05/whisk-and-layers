import { cakeRepository } from '../repositories/cakeRepository.js';
import { bakeryRepository } from '../repositories/bakeryRepository.js';

export class CakeService {
  public getAllCakes(params: any) {
    return cakeRepository.findAll(params);
  }

  public getCakeByIdOrSlug(identifier: string | number) {
    const isNum = !isNaN(Number(identifier));
    const cake = isNum
      ? cakeRepository.findById(Number(identifier))
      : cakeRepository.findBySlug(String(identifier));

    if (!cake) {
      throw new Error('Cake not found.');
    }
    return cake;
  }

  public getCategories() {
    return cakeRepository.getCategories();
  }

  public createCake(userId: number, data: any) {
    const bakery = bakeryRepository.findByUserId(userId);
    if (!bakery) {
      throw new Error('Only bakery owners can create cake listings.');
    }

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    return cakeRepository.create({
      bakeryId: bakery.id,
      categoryId: data.categoryId,
      name: data.name,
      slug,
      description: data.description,
      basePrice: data.basePrice,
      preparationDays: data.preparationDays,
      imageUrl: data.imageUrl,
      galleryUrls: data.galleryUrls ? JSON.stringify(data.galleryUrls) : null,
      isCustomizable: data.isCustomizable,
      isAvailable: data.isAvailable,
    });
  }

  public updateCake(userId: number, cakeId: number, data: any) {
    const cake = cakeRepository.findById(cakeId);
    if (!cake) {
      throw new Error('Cake not found.');
    }

    const bakery = bakeryRepository.findByUserId(userId);
    if (!bakery || bakery.id !== cake.bakery_id) {
      throw new Error('Access denied. You can only update cakes belonging to your bakery.');
    }

    let slug = cake.slug;
    if (data.name && data.name !== cake.name) {
      slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;
    }

    return cakeRepository.update(cakeId, {
      ...data,
      slug,
      galleryUrls: data.galleryUrls ? JSON.stringify(data.galleryUrls) : undefined,
    });
  }

  public deleteCake(userId: number, cakeId: number) {
    const cake = cakeRepository.findById(cakeId);
    if (!cake) {
      throw new Error('Cake not found.');
    }

    const bakery = bakeryRepository.findByUserId(userId);
    if (!bakery || bakery.id !== cake.bakery_id) {
      throw new Error('Access denied. You can only delete cakes belonging to your bakery.');
    }

    return cakeRepository.delete(cakeId);
  }
}

export const cakeService = new CakeService();
