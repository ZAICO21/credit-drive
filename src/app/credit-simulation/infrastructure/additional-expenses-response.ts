import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface AdditionalExpenseResource extends BaseResource {
  id: string;
  simulation_id: string;
  concept: string;
  type: string;
  amount: number;
  installment_start: number;
  installment_end: number;
  description: string;
}

export interface AdditionalExpensesResponse extends BaseResponse {
  additional_expenses: AdditionalExpenseResource[];
}
