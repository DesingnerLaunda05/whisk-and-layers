import { ApiClient } from './apiClient';
import { CustomizationOption, CustomOptionType } from '../types';

export const customizationApi = {
  getOptions: () =>
    ApiClient.get<{
      grouped: Record<CustomOptionType, CustomizationOption[]>;
      all: CustomizationOption[];
    }>('/customizations/options'),

  calculatePrice: (basePrice: number, optionIds: number[]) =>
    ApiClient.post<{ total: number }>('/customizations/calculate', { basePrice, optionIds }),
};
