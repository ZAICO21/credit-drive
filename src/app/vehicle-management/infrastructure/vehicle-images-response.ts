import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface VehicleImageResource extends BaseResource {
  id: string;
  vehicle_id: string;
  url: string;
  is_primary: boolean;
  order: number;
}

export interface VehicleImagesResponse extends BaseResponse {
  vehicle_images: VehicleImageResource[];
}
