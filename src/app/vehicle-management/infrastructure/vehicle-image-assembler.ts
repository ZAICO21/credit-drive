import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {VehicleImage} from '../domain/model/vehicle-image.entity';
import {VehicleImageResource, VehicleImagesResponse} from './vehicle-images-response';

export class VehicleImageAssembler implements BaseAssembler<VehicleImage, VehicleImageResource, VehicleImagesResponse> {
  toEntityFromResource(resource: VehicleImageResource): VehicleImage {
    return new VehicleImage({
      id: resource.id,
      vehicleId: resource.vehicle_id,
      url: resource.url,
      isPrimary: resource.is_primary,
      order: resource.order
    });
  }

  toResourceFromEntity(entity: VehicleImage): VehicleImageResource {
    return {
      id: entity.id,
      vehicle_id: entity.vehicleId,
      url: entity.url,
      is_primary: entity.isPrimary,
      order: entity.order
    };
  }

  toEntitiesFromResponse(response: VehicleImagesResponse): VehicleImage[] {
    return response.vehicle_images.map(resource => this.toEntityFromResource(resource));
  }
}
