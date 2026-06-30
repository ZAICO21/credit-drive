export type RateType = 'EFECTIVA' | 'NOMINAL';

export type GraceType = 'NINGUNA' | 'PARCIAL' | 'TOTAL';

export type PeriodType = 'NORMAL' | 'GRACIA_PARCIAL' | 'GRACIA_TOTAL';

export type CapitalizationType = 'DIARIA' | 'QUINCENAL' | 'MENSUAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

/**
 * Number of capitalization periods per year for each TNA capitalization type,
 * per the report's "Tipo de Capitalización" catalog (0=Diaria ... 6=Anual).
 */
export const CAPITALIZATION_PERIODS_PER_YEAR: Record<CapitalizationType, number> = {
  DIARIA: 360,
  QUINCENAL: 24,
  MENSUAL: 12,
  BIMESTRAL: 6,
  TRIMESTRAL: 4,
  SEMESTRAL: 2,
  ANUAL: 1
};
