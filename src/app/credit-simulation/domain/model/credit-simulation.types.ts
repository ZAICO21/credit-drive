export type RateType = 'EFECTIVA' | 'NOMINAL';

export type GraceType = 'NINGUNA' | 'PARCIAL' | 'TOTAL';

export type PeriodType = 'NORMAL' | 'GRACIA_PARCIAL' | 'GRACIA_TOTAL';

export type CashFlowType = 'INSTALLMENT' | 'BALLOON';

export type CapitalizationType =
  | 'DIARIA'
  | 'QUINCENAL'
  | 'MENSUAL'
  | 'BIMESTRAL'
  | 'TRIMESTRAL'
  | 'SEMESTRAL'
  | 'ANUAL';

/**
 * El trabajo usa meses ordinarios de 30 días.
 * Por eso, para capitalización diaria usamos año financiero de 360 días.
 */
export const CAPITALIZATION_PERIODS_PER_YEAR: Record<CapitalizationType, number> = {
  DIARIA: 360,
  QUINCENAL: 24,
  MENSUAL: 12,
  BIMESTRAL: 6,
  TRIMESTRAL: 4,
  SEMESTRAL: 2,
  ANUAL: 1,
};

export type ExpenseStage = 'INITIAL' | 'PERIODIC';

export type ExpensePaymentBehavior = 'FINANCED' | 'PAID_IN_INSTALLMENT';

export type ExpenseAmountType = 'FIXED' | 'PERCENTAGE';

export type ExpenseBaseCalculation =
  | 'FIXED_AMOUNT'
  | 'VEHICLE_PRICE'
  | 'LOAN_AMOUNT'
  | 'REGULAR_BALANCE'
  | 'FINAL_QUOTA_BALANCE';

export interface SimulationExpenseInput {
  concept: string;
  amount: number;
  expenseStage: ExpenseStage;
  paymentBehavior: ExpensePaymentBehavior;
  amountType?: ExpenseAmountType;
  rateValue?: number | null;
  baseCalculation?: ExpenseBaseCalculation | null;
  installmentStart?: number | null;
  installmentEnd?: number | null;
  description?: string | null;
}
