import {Component, inject} from '@angular/core';
import {FormControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {Vehicle} from '../../../domain/model/vehicle.entity';
import {VehicleImageInput, VehicleStore} from '../../../application/vehicle.store';

type ImageFormGroup = FormGroup<{
  id: FormControl<string | null>;
  url: FormControl<string>;
  isPrimary: FormControl<boolean>;
}>;

/**
 * Create/edit screen for a Vehicle, including its image gallery.
 * Route param `id` switches the form to edit mode.
 */
@Component({
  selector: 'app-vehicle-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css'
})
export class VehicleForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(VehicleStore);

  protected vehicleId: string | null = null;
  protected isEdit = false;

  readonly images = this.fb.array<ImageFormGroup>([]);

  readonly form = this.fb.nonNullable.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1990), Validators.max(2100)]],
    color: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    currencyCatalogId: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    status: [true],
    images: this.images
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleId = id;
      this.isEdit = true;
      const vehicle = this.store.getVehicleById(id)();
      if (vehicle) {
        this.form.patchValue({
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          price: vehicle.price,
          currencyCatalogId: vehicle.currencyCatalogId,
          stock: vehicle.stock,
          status: vehicle.status
        });
        vehicle.images.forEach(image => this.images.push(this.buildImageGroup(image.url, image.isPrimary, image.id)));
      }
    }

    if (this.images.length === 0) {
      this.images.push(this.buildImageGroup('', true));
    }
  }

  private buildImageGroup(url: string, isPrimary: boolean, id: string | null = null): ImageFormGroup {
    return this.fb.group({
      id: new FormControl<string | null>(id),
      url: new FormControl(url, {nonNullable: true, validators: [Validators.required]}),
      isPrimary: new FormControl(isPrimary, {nonNullable: true})
    });
  }

  addImage(): void {
    this.images.push(this.buildImageGroup('', this.images.length === 0));
  }

  removeImage(index: number): void {
    const wasPrimary = this.images.at(index).get('isPrimary')!.value;
    this.images.removeAt(index);
    if (wasPrimary && this.images.length > 0) {
      this.images.at(0).get('isPrimary')!.setValue(true);
    }
  }

  setPrimary(index: number): void {
    this.images.controls.forEach((control, i) => control.get('isPrimary')!.setValue(i === index));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const vehicle = new Vehicle({
      id: this.vehicleId ?? '',
      brand: value.brand,
      model: value.model,
      year: value.year,
      color: value.color,
      price: value.price,
      currencyCatalogId: value.currencyCatalogId,
      stock: value.stock,
      status: value.status
    });

    const imagesInput: VehicleImageInput[] = value.images
      .filter(image => image.url && image.url.trim().length > 0)
      .map(image => ({id: image.id ?? undefined, url: image.url.trim(), isPrimary: image.isPrimary}));

    if (imagesInput.length > 0 && !imagesInput.some(image => image.isPrimary)) {
      imagesInput[0].isPrimary = true;
    }

    if (this.isEdit) {
      this.store.updateVehicle(vehicle, imagesInput);
    } else {
      this.store.addVehicle(vehicle, imagesInput);
    }

    this.router.navigate(['/vehicles']);
  }
}
