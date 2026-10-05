import { customizationRepository } from '../repositories/customizationRepository.js';

export class CustomizationService {
  public getAllOptions() {
    return customizationRepository.findAllActive();
  }

  public getGroupedOptions() {
    return customizationRepository.getGroupedOptions();
  }

  public calculateCustomPrice(basePrice: number, selectedOptionIds: number[]): number {
    let total = basePrice;
    for (const optId of selectedOptionIds) {
      const opt = customizationRepository.findById(optId);
      if (opt && opt.is_active === 1) {
        total += opt.extra_price;
      }
    }
    return Math.round(total * 100) / 100;
  }
}

export const customizationService = new CustomizationService();
