import {computed, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {forkJoin, of, retry, switchMap} from 'rxjs';
import {CreditSimulationApi} from '../infrastructure/credit-simulation-api';
import {CreditSimulationInput, CreditSimulationResult, CreditSimulationService} from '../domain/services/credit-simulation.service';
import {CurrencyCode, Simulation} from '../domain/model/simulation.entity';
import {PaymentScheduleEntry} from '../domain/model/payment-schedule-entry.entity';
import {InsuranceSimulation} from '../domain/model/insurance-simulation.entity';
import {AdditionalExpense, AdditionalExpenseType} from '../domain/model/additional-expense.entity';
import {InsuranceType} from '../domain/model/insurance-type.entity';
import {Setting} from '../domain/model/setting.entity';

export interface InsuranceLineInput {
  insuranceTypeId: string;
  monthlyRate: number;
  baseCalculo: string;
  applies: boolean;
}

export interface AdditionalExpenseInput {
  concept: string;
  type: AdditionalExpenseType;
  amount: number;
  installmentStart: number;
  installmentEnd: number;
  description: string;
}

export interface SaveSimulationParams {
  clientId: string;
  vehicleId: string;
  userId: string;
  currency: CurrencyCode;
  disbursementDate: string;
  input: CreditSimulationInput;
  result: CreditSimulationResult;
  insuranceLines: InsuranceLineInput[];
  additionalExpenses: AdditionalExpenseInput[];
}

/**
 * Orchestrates the "Compra Inteligente" simulation: runs the pure domain
 * calculation (CreditSimulationService) and persists the resulting
 * simulation, payment schedule, insurance lines and additional expenses
 * as separate collections linked by `simulationId` (Persistencia Opción A).
 */
@Injectable({providedIn: 'root'})
export class CreditSimulationStore {
  private readonly simulationsSignal = signal<Simulation[]>([]);
  readonly simulations = this.simulationsSignal.asReadonly();

  private readonly paymentScheduleSignal = signal<PaymentScheduleEntry[]>([]);
  readonly paymentSchedule = this.paymentScheduleSignal.asReadonly();

  private readonly insuranceSimulationsSignal = signal<InsuranceSimulation[]>([]);
  readonly insuranceSimulations = this.insuranceSimulationsSignal.asReadonly();

  private readonly additionalExpensesSignal = signal<AdditionalExpense[]>([]);
  readonly additionalExpenses = this.additionalExpensesSignal.asReadonly();

  private readonly insuranceTypesSignal = signal<InsuranceType[]>([]);
  readonly insuranceTypes = this.insuranceTypesSignal.asReadonly();

  private readonly settingsSignal = signal<Setting[]>([]);
  readonly settings = this.settingsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private creditSimulationApi: CreditSimulationApi) {
    this.loadAll();
  }

  private formatError(error: any, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }

  loadAll(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    forkJoin({
      simulations: this.creditSimulationApi.getSimulations(),
      paymentSchedule: this.creditSimulationApi.getPaymentSchedule(),
      insuranceSimulations: this.creditSimulationApi.getInsuranceSimulations(),
      additionalExpenses: this.creditSimulationApi.getAdditionalExpenses(),
      insuranceTypes: this.creditSimulationApi.getInsuranceTypes(),
      settings: this.creditSimulationApi.getSettings()
    }).pipe(takeUntilDestroyed()).subscribe({
      next: data => {
        this.simulationsSignal.set(data.simulations);
        this.paymentScheduleSignal.set(data.paymentSchedule);
        this.insuranceSimulationsSignal.set(data.insuranceSimulations);
        this.additionalExpensesSignal.set(data.additionalExpenses);
        this.insuranceTypesSignal.set(data.insuranceTypes);
        this.settingsSignal.set(data.settings);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudieron cargar las simulaciones.'));
        this.loadingSignal.set(false);
      }
    });
  }

  /** Runs the pure "Compra Inteligente" calculation without persisting anything. */
  simulate(input: CreditSimulationInput): CreditSimulationResult {
    return CreditSimulationService.simulate(input);
  }

  getSimulationById(id: string): Signal<Simulation | undefined> {
    return computed(() => this.simulations().find(simulation => simulation.id === id));
  }

  getScheduleBySimulationId(simulationId: string): Signal<PaymentScheduleEntry[]> {
    return computed(() => this.paymentSchedule()
      .filter(entry => entry.simulationId === simulationId)
      .sort((a, b) => a.installmentNumber - b.installmentNumber));
  }

  getInsuranceSimulationsBySimulationId(simulationId: string): Signal<InsuranceSimulation[]> {
    return computed(() => this.insuranceSimulations().filter(line => line.simulationId === simulationId));
  }

  getAdditionalExpensesBySimulationId(simulationId: string): Signal<AdditionalExpense[]> {
    return computed(() => this.additionalExpenses().filter(expense => expense.simulationId === simulationId));
  }

  getSettingByUserId(userId: string): Signal<Setting | undefined> {
    return computed(() => this.settings().find(setting => setting.userId === userId));
  }

  /** Persists a simulation together with its payment schedule, insurance lines and additional expenses. */
  saveSimulation(params: SaveSimulationParams): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const simulation = new Simulation({
      id: '',
      clientId: params.clientId,
      vehicleId: params.vehicleId,
      userId: params.userId,
      vehiclePrice: params.input.vehiclePrice,
      currency: params.currency,
      initialFeePercentage: params.input.initialFeePercentage,
      initialFeeAmount: params.result.initialFeeAmount,
      financedAmount: params.result.financedAmount,
      termMonths: params.input.termMonths,
      futureValuePercentage: params.input.futureValuePercentage,
      futureValueAmount: params.result.futureValueAmount,
      rateType: params.input.rateType,
      interestRate: params.input.interestRate,
      capitalization: params.input.capitalization ?? null,
      monthlyEffectiveRate: params.result.monthlyEffectiveRate,
      graceType: params.input.graceType,
      gracePeriod: params.input.gracePeriods,
      portes: params.input.portes,
      baseQuota: params.result.baseQuota,
      tcea: params.result.tcea,
      van: params.result.van,
      tir: params.result.tir,
      disbursementDate: params.disbursementDate,
      registrationDate: new Date().toISOString()
    });

    this.creditSimulationApi.createSimulation(simulation).pipe(
      retry(2),
      switchMap(createdSimulation => {
        const scheduleEntries = this.buildScheduleEntries(createdSimulation, params);
        const insuranceLines = params.insuranceLines.map(line => new InsuranceSimulation({
          id: '',
          simulationId: createdSimulation.id,
          insuranceTypeId: line.insuranceTypeId,
          monthlyRate: line.monthlyRate,
          baseCalculo: line.baseCalculo,
          applies: line.applies
        }));
        const expenses = params.additionalExpenses.map(expense => new AdditionalExpense({
          id: '',
          simulationId: createdSimulation.id,
          concept: expense.concept,
          type: expense.type,
          amount: expense.amount,
          installmentStart: expense.installmentStart,
          installmentEnd: expense.installmentEnd,
          description: expense.description
        }));

        const creations = [
          ...scheduleEntries.map(entry => this.creditSimulationApi.createPaymentScheduleEntry(entry)),
          ...insuranceLines.map(line => this.creditSimulationApi.createInsuranceSimulation(line)),
          ...expenses.map(expense => this.creditSimulationApi.createAdditionalExpense(expense))
        ];

        return forkJoin({
          simulation: of(createdSimulation),
          schedule: creations.length > 0 ? forkJoin(creations) : of([])
        });
      })
    ).subscribe({
      next: ({simulation: createdSimulation}) => {
        this.simulationsSignal.update(simulations => [...simulations, createdSimulation]);
        this.loadAll();
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudo guardar la simulación.'));
        this.loadingSignal.set(false);
      }
    });
  }

  /** Removes a simulation and all its dependent payment schedule, insurance and expense rows. */
  deleteSimulation(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const scheduleIds = this.paymentSchedule().filter(entry => entry.simulationId === id).map(entry => entry.id);
    const insuranceIds = this.insuranceSimulations().filter(line => line.simulationId === id).map(line => line.id);
    const expenseIds = this.additionalExpenses().filter(expense => expense.simulationId === id).map(expense => expense.id);

    const deletions = [
      ...scheduleIds.map(entryId => this.creditSimulationApi.deletePaymentScheduleEntry(entryId)),
      ...insuranceIds.map(lineId => this.creditSimulationApi.deleteInsuranceSimulation(lineId)),
      ...expenseIds.map(expenseId => this.creditSimulationApi.deleteAdditionalExpense(expenseId))
    ];

    (deletions.length > 0 ? forkJoin(deletions) : of([])).pipe(
      switchMap(() => this.creditSimulationApi.deleteSimulation(id))
    ).subscribe({
      next: () => {
        this.simulationsSignal.update(simulations => simulations.filter(simulation => simulation.id !== id));
        this.paymentScheduleSignal.update(entries => entries.filter(entry => entry.simulationId !== id));
        this.insuranceSimulationsSignal.update(lines => lines.filter(line => line.simulationId !== id));
        this.additionalExpensesSignal.update(expenses => expenses.filter(expense => expense.simulationId !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'No se pudo eliminar la simulación.'));
        this.loadingSignal.set(false);
      }
    });
  }

  private buildScheduleEntries(simulation: Simulation, params: SaveSimulationParams): PaymentScheduleEntry[] {
    return params.result.schedule.map((period, index) => {
      const installmentNumber = index + 1;
      const otherExpenses = params.additionalExpenses
        .filter(expense => installmentNumber >= expense.installmentStart && installmentNumber <= expense.installmentEnd)
        .reduce((sum, expense) => sum + expense.amount, 0);

      const balloon = period.isBalloonPayment ? params.result.futureValueAmount : 0;
      const totalPayment = period.totalPayment + otherExpenses + balloon;

      return new PaymentScheduleEntry({
        id: '',
        simulationId: simulation.id,
        installmentNumber,
        paymentDate: this.addMonths(params.disbursementDate, installmentNumber),
        periodType: period.periodType,
        initialBalance: period.initialBalance,
        interest: period.interest,
        amortization: period.amortization,
        totalInsurance: period.insuranceDesgravamen + period.insuranceVehicular,
        portes: period.portes,
        otherExpenses,
        totalPayment,
        finalBalance: period.finalBalance,
        cashFlow: -totalPayment
      });
    });
  }

  private addMonths(isoDate: string, months: number): string {
    const [year, month, day] = isoDate.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1 + months, day));
    return date.toISOString().slice(0, 10);
  }
}
