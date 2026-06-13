import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface SettingResource extends BaseResource {
  id: string;
  user_id: string;
  default_currency_catalog_id: string;
  default_interest_type: string;
  default_grace_period: string;
  default_opportunity_tea: number;
  default_change_usd_pen: number;
}

export interface SettingsResponse extends BaseResponse {
  settings: SettingResource[];
}
