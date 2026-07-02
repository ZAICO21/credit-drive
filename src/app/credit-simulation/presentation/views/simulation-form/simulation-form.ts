import { Component, effect, inject, signal } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ClientStore } from '../../../../client-management/application/client.store';
import { VehicleStore } from '../../../../vehicle-management/application/vehicle.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { CreditSimulationStore } from '../../../application/credit-simulation.store';

import {
  CapitalizationType,
  ExpenseAmountType,
  ExpenseBaseCalculation,
  ExpensePaymentBehavior,
  ExpenseStage,
  PeriodType,
  RateType,
} from '../../../domain/model/credit-simulation.types';

import {
  CreditSimulationInput,
  CreditSimulationResult,
} from '../../../domain/services/credit-simulation.service';

import { AdditionalExpenseType } from '../../../domain/model/additional-expense.entity';

import {
  InsuranceBaseCalculation,
  InsuranceRatePeriod,
  InsuranceType,
} from '../../../domain/model/insurance-type.entity';

import { CurrencyCode } from '../../../domain/model/simulation.entity';

type InsuranceLineGroup = FormGroup<{
  insuranceTypeId: FormControl<string>;
  name: FormControl<string>;
  baseCalculo: FormControl<string>;
  monthlyRate: FormControl<number>;
  applies: FormControl<boolean>;

  rateValue: FormControl<number>;
  ratePeriod: FormControl<InsuranceRatePeriod>;
  baseCalculation: FormControl<InsuranceBaseCalculation>;
}>;

type ExpenseGroup = FormGroup<{
  concept: FormControl<string>;
  type: FormControl<AdditionalExpenseType>;
  amount: FormControl<number>;
  installmentStart: FormControl<number>;
  installmentEnd: FormControl<number>;
  description: FormControl<string>;

  expenseStage: FormControl<ExpenseStage>;
  paymentBehavior: FormControl<ExpensePaymentBehavior>;
  amountType: FormControl<ExpenseAmountType>;
  rateValue: FormControl<number>;
  baseCalculation: FormControl<ExpenseBaseCalculation>;
}>;

/**
 * Compra Inteligente simulation form.
 *
 * Updated to match the Excel-based financial model:
 * - Final quota / balloon calculated over vehicle price.
 * - Total grace + partial grace.
 * - Initial financed expenses.
 * - Periodic expenses.
 * - Desgravamen and risk insurance.
 * - VAN/TIR/TCEA from the debtor cash flow.
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
    MatCheckboxModule,
  ],
  templateUrl: './simulation-form.html',
  styleUrl: './simulation-form.css',
})
export class SimulationForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly store = inject(CreditSimulationStore);
  protected readonly clientStore = inject(ClientStore);
  protected readonly vehicleStore = inject(VehicleStore);

  private readonly iamStore = inject(IamStore);

  protected readonly capitalizationOptions: CapitalizationType[] = [
    'DIARIA',
    'QUINCENAL',
    'MENSUAL',
    'BIMESTRAL',
    'TRIMESTRAL',
    'SEMESTRAL',
    'ANUAL',
  ];

  protected readonly expenseStageOptions: ExpenseStage[] = ['INITIAL', 'PERIODIC'];
  protected readonly paymentBehaviorOptions: ExpensePaymentBehavior[] = [
    'FINANCED',
    'PAID_IN_INSTALLMENT',
  ];

  readonly insuranceLines = this.fb.array<InsuranceLineGroup>([]);
  readonly additionalExpenses = this.fb.array<ExpenseGroup>([]);

  private readonly defaultsApplied = signal(false);

  readonly form = this.fb.nonNullable.group({
    clientId: ['', Validators.required],
    vehicleId: ['', Validators.required],

    vehiclePrice: [0, [Validators.required, Validators.min(0)]],
    currency: ['PEN' as CurrencyCode, Validators.required],
    currencyCatalogId: [''],

    initialFeePercentage: [20, [Validators.required, Validators.min(0), Validators.max(100)]],

    termMonths: [36, [Validators.required, Validators.min(1)]],

    /**
     * UI name aligned with Excel.
     * We still pass it also as futureValuePercentage for compatibility.
     */
    finalQuotaPercentage: [30, [Validators.required, Validators.min(0), Validators.max(100)]],

    rateType: ['EFECTIVA' as RateType, Validators.required],
    interestRate: [0, [Validators.required, Validators.min(0)]],
    capitalization: ['MENSUAL' as CapitalizationType, Validators.required],

    totalGracePeriods: [0, [Validators.required, Validators.min(0)]],
    partialGracePeriods: [0, [Validators.required, Validators.min(0)]],

    paymentFrequencyDays: [30, [Validators.required, Validators.min(1)]],
    daysPerYear: [360, [Validators.required, Validators.min(1)]],

    opportunityTeaPercent: [0, [Validators.required, Validators.min(0)]],

    gps: [0, [Validators.min(0)]],
    portes: [0, [Validators.min(0)]],
    administrativeExpenses: [0, [Validators.min(0)]],

    disbursementDate: [this.todayIso(), Validators.required],

    insuranceLines: this.insuranceLines,
    additionalExpenses: this.additionalExpenses,
  });

  readonly result = signal<CreditSimulationResult | null>(null);

  constructor() {
    effect(() => {
      const types = this.store.insuranceTypes();

      if (types.length > 0 && this.insuranceLines.length === 0) {
        types.forEach((type) => this.insuranceLines.push(this.buildInsuranceGroup(type)));
      }
    });

    effect(() => {
      const currentUser = this.iamStore.currentUser();

      if (!currentUser || this.defaultsApplied()) {
        return;
      }

      const setting = this.store.settings().find((item) => item.userId === currentUser.id);

      if (!setting) {
        return;
      }

      this.form.patchValue({
        currencyCatalogId: setting.defaultCurrencyCatalogId,
        rateType: setting.defaultInterestType,
        capitalization: setting.defaultCapitalization,
        totalGracePeriods: setting.defaultTotalGracePeriods,
        partialGracePeriods: setting.defaultPartialGracePeriods,
        paymentFrequencyDays: setting.defaultPaymentFrequencyDays,
        daysPerYear: setting.defaultDaysPerYear,
        opportunityTeaPercent: setting.defaultOpportunityTea,
        gps: setting.defaultGps,
        portes: setting.defaultPortes,
        administrativeExpenses: setting.defaultAdministrativeExpense,
      });

      this.defaultsApplied.set(true);
    });

    this.form.controls.vehicleId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((vehicleId) => this.onVehicleChange(vehicleId));

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.result.set(null));
  }

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private buildInsuranceGroup(type: InsuranceType): InsuranceLineGroup {
    return this.fb.nonNullable.group({
      insuranceTypeId: type.id,
      name: type.name,
      baseCalculo:
        type.baseCalculo ?? this.mapInsuranceBaseCalculationToLegacy(type.baseCalculation),
      monthlyRate: type.monthlyRate,
      applies: type.mandatory,

      rateValue: type.rateValue,
      ratePeriod: type.ratePeriod,
      baseCalculation: type.baseCalculation,
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
      currencyCatalogId: vehicle.currencyCatalogId,
      currency: (catalog?.currency as CurrencyCode) ?? this.form.controls.currency.value,
    });
  }

  addExpense(): void {
    this.additionalExpenses.push(
      this.fb.nonNullable.group({
        concept: ['', Validators.required],
        type: ['PERIODICO' as AdditionalExpenseType, Validators.required],
        amount: [0, [Validators.required, Validators.min(0)]],
        installmentStart: [1, [Validators.required, Validators.min(1)]],
        installmentEnd: [1, [Validators.required, Validators.min(1)]],
        description: [''],

        expenseStage: ['PERIODIC' as ExpenseStage, Validators.required],
        paymentBehavior: ['PAID_IN_INSTALLMENT' as ExpensePaymentBehavior, Validators.required],
        amountType: ['FIXED' as ExpenseAmountType, Validators.required],
        rateValue: [0, [Validators.min(0)]],
        baseCalculation: ['FIXED_AMOUNT' as ExpenseBaseCalculation, Validators.required],
      }),
    );
  }

  addInitialFinancedExpense(): void {
    this.additionalExpenses.push(
      this.fb.nonNullable.group({
        concept: ['Gasto inicial financiado', Validators.required],
        type: ['UNICO' as AdditionalExpenseType, Validators.required],
        amount: [0, [Validators.required, Validators.min(0)]],
        installmentStart: [1, [Validators.required, Validators.min(1)]],
        installmentEnd: [1, [Validators.required, Validators.min(1)]],
        description: [''],

        expenseStage: ['INITIAL' as ExpenseStage, Validators.required],
        paymentBehavior: ['FINANCED' as ExpensePaymentBehavior, Validators.required],
        amountType: ['FIXED' as ExpenseAmountType, Validators.required],
        rateValue: [0, [Validators.min(0)]],
        baseCalculation: ['FIXED_AMOUNT' as ExpenseBaseCalculation, Validators.required],
      }),
    );
  }

  removeExpense(index: number): void {
    this.additionalExpenses.removeAt(index);
  }

  onExpenseStageChange(group: ExpenseGroup): void {
    const stage = group.controls.expenseStage.value;

    if (stage === 'INITIAL') {
      group.controls.type.setValue('UNICO');
      group.controls.paymentBehavior.setValue('FINANCED');
      group.controls.installmentStart.setValue(1);
      group.controls.installmentEnd.setValue(1);
      return;
    }

    group.controls.type.setValue('PERIODICO');
    group.controls.paymentBehavior.setValue('PAID_IN_INSTALLMENT');
  }

  private buildInput(): CreditSimulationInput {
    const value = this.form.getRawValue();

    const desgravamen = this.findInsuranceLine(value.insuranceLines, [
      'desgravamen',
      'desgravámen',
    ]);

    const riskInsurance = this.findInsuranceLine(value.insuranceLines, [
      'vehicular',
      'riesgo',
      'vsv',
      'vsvi',
    ]);

    const additionalExpenses = value.additionalExpenses.map((expense) => ({
      concept: expense.concept,
      amount: expense.amount,
      expenseStage: expense.expenseStage,
      paymentBehavior: expense.paymentBehavior,
      amountType: expense.amountType,
      rateValue: expense.rateValue,
      baseCalculation: expense.baseCalculation,
      installmentStart: expense.expenseStage === 'INITIAL' ? null : expense.installmentStart,
      installmentEnd: expense.expenseStage === 'INITIAL' ? null : expense.installmentEnd,
      description: expense.description,
    }));

    return {
      vehiclePrice: value.vehiclePrice,
      initialFeePercentage: value.initialFeePercentage,
      termMonths: value.termMonths,

      finalQuotaPercentage: value.finalQuotaPercentage,
      futureValuePercentage: value.finalQuotaPercentage,

      rateType: value.rateType,
      interestRate: value.interestRate,
      capitalization: value.rateType === 'NOMINAL' ? value.capitalization : null,

      paymentFrequencyDays: value.paymentFrequencyDays,
      daysPerYear: value.daysPerYear,

      totalGracePeriods: value.totalGracePeriods,
      partialGracePeriods: value.partialGracePeriods,

      desgravamenRatePercent: desgravamen?.applies ? desgravamen.rateValue : 0,
      desgravamenMonthlyRatePercent: desgravamen?.applies ? desgravamen.rateValue : 0,

      riskInsuranceAnnualRatePercent: riskInsurance?.applies ? riskInsurance.rateValue : 0,
      vehicularMonthlyRatePercent: riskInsurance?.applies ? riskInsurance.rateValue : 0,

      gps: value.gps,
      portes: value.portes,
      administrativeExpenses: value.administrativeExpenses,

      expenses: additionalExpenses,

      opportunityTeaPercent: value.opportunityTeaPercent || value.interestRate,
    };
  }

  private findInsuranceLine(
    lines: ReturnType<typeof this.form.getRawValue>['insuranceLines'],
    keywords: string[],
  ) {
    return lines.find((line) => {
      const normalizedName = line.name.toLowerCase();

      return keywords.some((keyword) => normalizedName.includes(keyword));
    });
  }

  simulate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.result.set(this.store.simulate(this.buildInput()));
    } catch (error) {
      this.result.set(null);
      console.error(error);
    }
  }

  save(): void {
    const result = this.result();

    if (!result || this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const currentUser = this.iamStore.currentUser();

    if (!currentUser) {
      return;
    }

    this.store.saveSimulation({
      clientId: value.clientId,
      vehicleId: value.vehicleId,
      userId: currentUser.id,

      currency: value.currency,
      currencyCatalogId: value.currencyCatalogId || null,

      disbursementDate: value.disbursementDate,

      input: this.buildInput(),
      result,

      insuranceLines: value.insuranceLines.map((line) => ({
        insuranceTypeId: line.insuranceTypeId,

        monthlyRate: line.monthlyRate,
        baseCalculo: line.baseCalculo,

        applies: line.applies,

        nameSnapshot: line.name,
        rateValue: line.rateValue,
        ratePeriod: line.ratePeriod,
        baseCalculation: line.baseCalculation,
      })),

      additionalExpenses: value.additionalExpenses.map((expense) => ({
        concept: expense.concept,
        type: expense.type,
        amount: expense.amount,

        installmentStart: expense.expenseStage === 'INITIAL' ? null : expense.installmentStart,
        installmentEnd: expense.expenseStage === 'INITIAL' ? null : expense.installmentEnd,
        description: expense.description,

        expenseStage: expense.expenseStage,
        paymentBehavior: expense.paymentBehavior,
        amountType: expense.amountType,
        rateValue: expense.rateValue,
        baseCalculation: expense.baseCalculation,
      })),
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

  cashFlowTypeLabel(cashFlowType: string): string {
    return cashFlowType === 'BALLOON' ? 'Cuotón final' : 'Cuota';
  }

  private mapInsuranceBaseCalculationToLegacy(baseCalculation: InsuranceBaseCalculation): string {
    switch (baseCalculation) {
      case 'VEHICLE_PRICE':
        return 'VEHICULO';
      case 'LOAN_AMOUNT':
        return 'MONTO_FINANCIADO';
      case 'FIXED_AMOUNT':
        return 'FIJO';
      case 'FINAL_QUOTA_BALANCE':
      case 'REGULAR_BALANCE':
      default:
        return 'SALDO';
    }
  }
}
