import { ValueTransformer } from 'typeorm';
import isNullOrUndefined from './utils';

/**
 * O Postgres retorna algumas colunas numéricas, como DECIMAL por
 * exemplo, como string e isso impede operações aritméticas nesses
 * valores. Para contornar esse problema, podemos atribuir este
 * transformer na definição da coluna do Model quando usar Postgres
 */

class DecimalNumericTransformer implements ValueTransformer {
  to(data?: number | null): number | null {
    if (!isNullOrUndefined(data)) {
      return data;
    }
    return null;
  }

  from(data?: string | null): number | null {
    if (!isNullOrUndefined(data)) {
      const res = parseFloat(data);
      if (isNaN(res)) {
        return null;
      }
      return res;
    }
    return null;
  }
}

export default DecimalNumericTransformer;
