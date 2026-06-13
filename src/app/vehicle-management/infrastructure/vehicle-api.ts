import {BaseApi} from '../../shared/infrastructure/base-api';
import {VehiclesApiEndpoint} from './vehicles-api-endpoint';
import {VehicleImagesApiEndpoint} from './vehicle-images-api-endpoint';
import {CurrencyCatalogsApiEndpoint} from './currency-catalogs-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleImage} from '../domain/model/vehicle-image.entity';

@Injectable({providedIn: 'root'})
export class VehicleApi extends BaseApi {
  private readonly vehiclesEndpoint: VehiclesApiEndpoint;
  private readonly vehicleImagesEndpoint: VehicleImagesApiEndpoint;
  private readonly currencyCatalogsEndpoint: CurrencyCatalogsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.vehiclesEndpoint = new VehiclesApiEndpoint(http);
    this.vehicleImagesEndpoint = new VehicleImagesApiEndpoint(http);
    this.currencyCatalogsEndpoint = new CurrencyCatalogsApiEndpoint(http);
  }

  getVehicles() {
    return this.vehiclesEndpoint.getAll();
  }

  getVehicleById(id: string) {
    return this.vehiclesEndpoint.getById(id);
  }

  createVehicle(vehicle: Vehicle) {
    return this.vehiclesEndpoint.create(vehicle);
  }

  updateVehicle(vehicle: Vehicle) {
    return this.vehiclesEndpoint.update(vehicle, vehicle.id);
  }

  deleteVehicle(id: string) {
    return this.vehiclesEndpoint.delete(id);
  }

  getVehicleImages() {
    return this.vehicleImagesEndpoint.getAll();
  }

  createVehicleImage(image: VehicleImage) {
    return this.vehicleImagesEndpoint.create(image);
  }

  updateVehicleImage(image: VehicleImage) {
    return this.vehicleImagesEndpoint.update(image, image.id);
  }

  deleteVehicleImage(id: string) {
    return this.vehicleImagesEndpoint.delete(id);
  }

  getCurrencyCatalogs() {
    return this.currencyCatalogsEndpoint.getAll();
  }
}
