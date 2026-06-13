import {Component, effect, inject, signal} from '@angular/core';
import {DecimalPipe, PercentPipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ClientStore} from '../../../../client-management/application/client.store';
import {VehicleStore} from '../../../../vehicle-management/application/vehicle.store';
import {IamStore} from '../../../../iam/application/iam.store';
import {CreditSimulationStore} from '../../../application/credit-simulation.store';
import {CapitalizationType, GraceType, PeriodType, RateType} from '../../../domain/model/credit-simulation.types';
import {CreditSimulationInput, CreditSimulationResult} from '../../../domain/services/credit-simulation.service';
import {AdditionalExpenseType} from '../../../domain/model/additional-expense.entity';
import {InsuranceType} from '../../../domain/model/insurance-type.entity';
import {CurrencyCode} from '../../../domain/model/simulation.entity';

type InsuranceLineGroup = FormGroup<{
  insuranceTypeId: FormControl<string>;
  name: FormControl<string>;
  baseCalculo: FormControl<string>;
  monthlyRate: FormControl<number>;
  applies: FormControl<boolean>;
}>;

type ExpenseGroup = FormGroup<{
  concept: FormControl<string>;
  type: FormControl<AdditionalExpenseType>;
  amount: FormControl<number>;
  installmentStart: FormControl<number>;
  installmentEnd: FormControl<number>;
  description: FormControl<string>;
}>;

/**
 * "Compra Inteligente" simulation form: collects the credit conditions,
 * insurance lines and additional expenses, runs the pure domain calculation
 * for an interactive preview, and persists the result on save.
 */
@Component({
  selector: 'app-simulation-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    DecimalPipe,
    PercentPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './simulation-form.html',
  styleUrl: './simulation-form.css'
})
export class SimulationForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly store = inject(CreditSimulationStore);
  protected readonly clientStore = inject(ClientStore);
  protected readonly vehicleStore = inject(VehicleStore);
  private readonly iamStore = inject(IamStore);

  protected readonly capitalizationOptions: CapitalizationType[] =
    ['DIARIA', 'QUINCENAL', 'MENSUAL', 'BIMESTRAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'];

  readonly insuranceLines = this.fb.array<InsuranceLineGroup>([]);
  readonly additionalExpenses = this.fb.array<ExpenseGroup>([]);

  readonly form = this.fb.nonNullable.group({
    clientId: ['', Validators.required],
    vehicleId: ['', Validators.required],
    vehiclePrice: [0, [Validators.required, Validators.min(0)]],
    currency: ['PEN' as CurrencyCode, Validators.required],
    initialFeePercentage: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    termMonths: [36, [Validators.required, Validators.min(1)]],
    futureValuePercentage: [30, [Validators.required, Validators.min(0), Validators.max(100)]],
    rateType: ['EFECTIVA' as RateType, Validators.required],
    interestRate: [0, [Validators.required, Validators.min(0)]],
    capitalization: ['MENSUAL' as CapitalizationType, Validators.required],
    graceType: ['NINGUNA' as GraceType, Validators.required],
    gracePeriods: [0, [Validators.min(0)]],
    portes: [0, [Validators.min(0)]],
    disbursementDate: [this.todayIso(), Validators.required],
    insuranceLines: this.insuranceLines,
    additionalExpenses: this.additionalExpenses
  });

  readonly result = signal<CreditSimulationResult | null>(null);

  constructor() {
    effect(() => {
      const types = this.store.insuranceTypes();
      if (types.length > 0 && this.insuranceLines.length === 0) {
        types.forEach(type => this.insuranceLines.push(this.buildInsuranceGroup(type)));
      }
    });

    this.form.controls.vehicleId.valueChanges.pipe(takeUntilDestroyed()).subscribe(vehicleId => this.onVehicleChange(vehicleId));
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.result.set(null));
  }

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private buildInsuranceGroup(type: InsuranceType): InsuranceLineGroup {
    return this.fb.nonNullable.group({
      insuranceTypeId: type.id,
      name: type.name,
      baseCalculo: type.baseCalculo,
      monthlyRate: type.monthlyRate,
      applies: true as boolean
    });
  }

  private onVehicleChange(vehicleId: string): void {
    const vehicle = this.vehicleStore.getVehicleById(vehicleId)();
    if (!vehicle) {
      return;
    }
    const catalog = this.vehicleStore.getCurrencyCatalogById(vehicle.currencyCatalogId)();
    this.form.patchValue({
      vehiclePrice: vehicle.price,
      currency: (catalog?.currency as CurrencyCode) ?? this.form.controls.currency.value
    });
  }

  addExpense(): void {
    this.additionalExpenses.push(this.fb.nonNullable.group({
      concept: ['', Validators.required],
      type: ['UNICO' as AdditionalExpenseType, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      installmentStart: [1, [Validators.required, Validators.min(1)]],
      installmentEnd: [1, [Validators.required, Validators.min(1)]],
      description: ['']
    }));
  }

  removeExpense(index: number): void {
    this.additionalExpenses.removeAt(index);
  }

  private buildInput(): CreditSimulationInput {
    const value = this.form.getRawValue();
    const vehicular = value.insuranceLines.find(line => line.name.toLowerCase().includes('vehicular'));
    const desgravamen = value.insuranceLines.find(line => line.name.toLowerCase().includes('desgravamen'));

    return {
      vehiclePrice: value.vehiclePrice,
      initialFeePercentage: value.initialFeePercentage,
      termMonths: value.termMonths,
      futureValuePercentage: value.futureValuePercentage,
      rateType: value.rateType,
      interestRate: value.interestRate,
      capitalization: value.rateType === 'NOMINAL' ? value.capitalization : undefined,
      graceType: value.graceType,
      gracePeriods: value.graceType === 'NINGUNA' ? 0 : value.gracePeriods,
      desgravamenMonthlyRatePercent: desgravamen?.applies ? desgravamen.monthlyRate : 0,
      vehicularMonthlyRatePercent: vehicular?.applies ? vehicular.monthlyRate : 0,
      portes: value.portes
    };
  }

  simulate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.result.set(this.store.simulate(this.buildInput()));
  }

  save(): void {
    const result = this.result();
    if (!result || this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const userId = this.iamStore.currentUser()?.id ?? '';

    this.store.saveSimulation({
      clientId: value.clientId,
      vehicleId: value.vehicleId,
      userId,
      currency: value.currency,
      disbursementDate: value.disbursementDate,
      input: this.buildInput(),
      result,
      insuranceLines: value.insuranceLines.map(line => ({
        insuranceTypeId: line.insuranceTypeId,
        monthlyRate: line.monthlyRate,
        baseCalculo: line.baseCalculo,
        applies: line.applies
      })),
      additionalExpenses: value.additionalExpenses.map(expense => ({
        concept: expense.concept,
        type: expense.type,
        amount: expense.amount,
        installmentStart: expense.installmentStart,
        installmentEnd: expense.installmentEnd,
        description: expense.description
      }))
    });

    this.router.navigate(['/simulations']);
  }

  periodLabelKey(periodType: PeriodType): string {
    switch (periodType) {
      case 'GRACIA_PARCIAL':
        return 'simulation.period-gracia-parcial';
      case 'GRACIA_TOTAL':
        return 'simulation.period-gracia-total';
      default:
        return 'simulation.period-normal';
    }
  }
}
