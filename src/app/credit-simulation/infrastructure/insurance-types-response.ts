import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface InsuranceTypeResource extends BaseResource {
  id: string;
  name: string;
  description: string;
  base_calculo: string;
  tasa_mensual: number;
  mandatory: boolean;
  status: boolean;
}

export interface InsuranceTypesResponse extends BaseResponse {
  insurance_types: InsuranceTypeResource[];
}
