import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface PaymentScheduleResource extends BaseResource {
  id: string;
  simulation_id: string;
  installment_number: number;
  payment_date: string;
  period_type: string;
  initial_balance: number;
  interest: number;
  amortization: number;
  total_insurance: number;
  portes: number;
  other_expenses: number;
  total_payment: number;
  final_balance: number;
  cash_flow: number;
}

export interface PaymentScheduleResponse extends BaseResponse {
  payment_schedule: PaymentScheduleResource[];
}
