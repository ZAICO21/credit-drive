import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface SimulationResource extends BaseResource {
  id: string;
  client_id: string;
  vehicle_id: string;
  user_id: string;
  vehicle_price: number;
  currency: string;
  initial_fee_percentage: number;
  initial_fee_amount: number;
  financed_amount: number;
  term_months: number;
  future_value_percentage: number;
  future_value_amount: number;
  rate_type: string;
  interest_rate: number;
  capitalization: string | null;
  monthly_effective_rate: number;
  grace_type: string;
  grace_period: number;
  portes: number;
  cuota_base?: number;
  tcea: number;
  van: number;
  tir: number;
  disbursement_date: string;
  registration_date: string;
}

export interface SimulationsResponse extends BaseResponse {
  simulations: SimulationResource[];
}
