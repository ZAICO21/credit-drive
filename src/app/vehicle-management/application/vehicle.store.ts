import {computed, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleImage} from '../domain/model/vehicle-image.entity';
import {CurrencyCatalog} from '../domain/model/currency-catalog.entity';
import {VehicleApi} from '../infrastructure/vehicle-api';

/**
 * Image entry as edited in the vehicle form. `id` is present only for
 * images that already exist in `vehicle_images`; new entries omit it.
 */
export interface VehicleImageInput {
  id?: string;
  url: string;
  isPrimary: boolean;
}

@Injectable({providedIn: 'root'})
export class VehicleStore {
  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  private readonly imagesSignal = signal<VehicleImage[]>([]);
  private readonly currencyCatalogsSignal = signal<CurrencyCatalog[]>([]);

  readonly currencyCatalogs = this.currencyCatalogsSignal.asReadonly();

  readonly vehicles = computed(() =>
    this.vehiclesSignal().map(vehicle =>
      vehicle.withImages(this.imagesSignal().filter(image => image.vehicleId === vehicle.id)
        .sort((a, b) => a.order - b.order))
    )
  );

  readonly vehiclesCount = computed(() => this.vehicles().length);

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private vehicleApi: VehicleApi) {
    this.loadVehicles();
    this.loadVehicleImages();
    this.loadCurrencyCatalogs();
  }

  private formatError(error: any, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }

  loadVehicles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.vehicleApi.getVehicles().pipe(takeUntilDestroyed()).subscribe({
      next: vehicles => {
        this.vehiclesSignal.set(vehicles);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudieron cargar los vehículos.'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadVehicleImages(): void {
    this.vehicleApi.getVehicleImages().pipe(takeUntilDestroyed()).subscribe({
      next: images => this.imagesSignal.set(images),
      error: err => this.errorSignal.set(this.formatError(err, 'No se pudieron cargar las imágenes.'))
    });
  }

  private loadCurrencyCatalogs(): void {
    this.vehicleApi.getCurrencyCatalogs().pipe(takeUntilDestroyed()).subscribe({
      next: catalogs => this.currencyCatalogsSignal.set(catalogs),
      error: err => this.errorSignal.set(this.formatError(err, 'No se pudieron cargar las monedas.'))
    });
  }

  getVehicleById(id: string): Signal<Vehicle | undefined> {
    return computed(() => this.vehicles().find(vehicle => vehicle.id === id));
  }

  getCurrencyCatalogById(id: string): Signal<CurrencyCatalog | undefined> {
    return computed(() => this.currencyCatalogs().find(catalog => catalog.id === id));
  }

  /**
   * Creates a vehicle and its associated images (in order, first marked image becomes primary).
   */
  addVehicle(vehicle: Vehicle, images: VehicleImageInput[]): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.vehicleApi.createVehicle(vehicle).pipe(retry(2)).subscribe({
      next: created => {
        this.vehiclesSignal.update(vehicles => [...vehicles, created]);
        this.loadingSignal.set(false);
        images.forEach((image, index) => this.createImage(created.id, image, index));
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudo crear el vehículo.'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates a vehicle and synchronizes its image collection (creates new
   * entries, updates changed ones, deletes removed ones).
   */
  updateVehicle(vehicle: Vehicle, images: VehicleImageInput[]): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.vehicleApi.updateVehicle(vehicle).pipe(retry(2)).subscribe({
      next: updated => {
        this.vehiclesSignal.update(vehicles => vehicles.map(v => v.id === updated.id ? updated : v));
        this.loadingSignal.set(false);
        this.syncImages(updated.id, images);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudo actualizar el vehículo.'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteVehicle(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.vehicleApi.deleteVehicle(id).pipe(retry(2)).subscribe({
      next: () => {
        this.vehiclesSignal.update(vehicles => vehicles.filter(v => v.id !== id));
        this.loadingSignal.set(false);
        this.imagesSignal().filter(image => image.vehicleId === id)
          .forEach(image => this.deleteImage(image.id));
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudo eliminar el vehículo.'));
        this.loadingSignal.set(false);
      }
    });
  }

  private syncImages(vehicleId: string, inputs: VehicleImageInput[]): void {
    const existing = this.imagesSignal().filter(image => image.vehicleId === vehicleId);
    const keptIds = new Set(inputs.filter(input => input.id).map(input => input.id));

    existing.filter(image => !keptIds.has(image.id))
      .forEach(image => this.deleteImage(image.id));

    inputs.forEach((input, index) => {
      const order = index + 1;
      if (input.id) {
        const original = existing.find(image => image.id === input.id);
        if (original && (original.url !== input.url || original.isPrimary !== input.isPrimary || original.order !== order)) {
          this.updateImage(new VehicleImage({id: input.id, vehicleId, url: input.url, isPrimary: input.isPrimary, order}));
        }
      } else {
        this.createImage(vehicleId, input, index);
      }
    });
  }

  private createImage(vehicleId: string, input: VehicleImageInput, index: number): void {
    const image = new VehicleImage({id: '', vehicleId, url: input.url, isPrimary: input.isPrimary, order: index + 1});
    this.vehicleApi.createVehicleImage(image).pipe(retry(2)).subscribe({
      next: created => this.imagesSignal.update(images => [...images, created]),
      error: err => this.errorSignal.set(this.formatError(err, 'No se pudo guardar una imagen.'))
    });
  }

  private updateImage(image: VehicleImage): void {
    this.vehicleApi.updateVehicleImage(image).pipe(retry(2)).subscribe({
      next: updated => this.imagesSignal.update(images => images.map(i => i.id === updated.id ? updated : i)),
      error: err => this.errorSignal.set(this.formatError(err, 'No se pudo actualizar una imagen.'))
    });
  }

  private deleteImage(id: string): void {
    this.vehicleApi.deleteVehicleImage(id).pipe(retry(2)).subscribe({
      next: () => this.imagesSignal.update(images => images.filter(i => i.id !== id)),
      error: err => this.errorSignal.set(this.formatError(err, 'No se pudo eliminar una imagen.'))
    });
  }
}
