import { db } from '../database/db.js';
import { CustomizationOption, CustomOptionType } from '../types/index.js';

export class CustomizationRepository {
  public findAllActive(): CustomizationOption[] {
    return db.query<CustomizationOption>(
      'SELECT * FROM customization_options WHERE is_active = 1 ORDER BY type ASC, sort_order ASC, extra_price ASC'
    );
  }

  public findByType(type: CustomOptionType): CustomizationOption[] {
    return db.query<CustomizationOption>(
      'SELECT * FROM customization_options WHERE type = ? AND is_active = 1 ORDER BY sort_order ASC',
      [type]
    );
  }

  public findById(id: number): CustomizationOption | null {
    return db.queryOne<CustomizationOption>(
      'SELECT * FROM customization_options WHERE id = ?',
      [id]
    );
  }

  public getGroupedOptions(): Record<CustomOptionType, CustomizationOption[]> {
    const all = this.findAllActive();
    const grouped: Record<CustomOptionType, CustomizationOption[]> = {
      BASE: [],
      FLAVOR: [],
      SIZE: [],
      SHAPE: [],
      ICING: [],
      TOPPING: [],
      DECORATION: [],
    };

    for (const opt of all) {
      if (grouped[opt.type]) {
        grouped[opt.type].push(opt);
      }
    }

    return grouped;
  }
}

export const customizationRepository = new CustomizationRepository();
