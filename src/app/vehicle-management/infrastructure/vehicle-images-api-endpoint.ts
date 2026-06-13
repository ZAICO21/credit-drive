import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {VehicleImage} from '../domain/model/vehicle-image.entity';
import {VehicleImageResource, VehicleImagesResponse} from './vehicle-images-response';
import {VehicleImageAssembler} from './vehicle-image-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehicleImagesEndpointPath}`;

export class VehicleImagesApiEndpoint
  extends BaseApiEndpoint<VehicleImage, VehicleImageResource, VehicleImagesResponse, VehicleImageAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new VehicleImageAssembler());
  }
}
