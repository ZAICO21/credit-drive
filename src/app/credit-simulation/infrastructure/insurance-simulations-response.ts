import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface InsuranceSimulationResource extends BaseResource {
  id: string;
  simulation_id: string;
  tipo_seguro_id: string;
  tasa_mensual: number;
  base_calculo: string;
  applies: boolean;
}

export interface InsuranceSimulationsResponse extends BaseResponse {
  insurance_simulations: InsuranceSimulationResource[];
}
