import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {PeriodType} from './credit-simulation.types';

export interface PaymentScheduleEntryProps {
  id: string;
  simulationId: string;
  installmentNumber: number;
  paymentDate: string;
  periodType: PeriodType;
  initialBalance: number;
  interest: number;
  amortization: number;
  totalInsurance: number;
  portes: number;
  otherExpenses: number;
  totalPayment: number;
  finalBalance: number;
  cashFlow: number;
}

/** A single row (cuota) of a simulation's payment schedule (cronograma). */
export class PaymentScheduleEntry implements BaseEntity {
  private readonly _id: string;
  private readonly _simulationId: string;
  private readonly _installmentNumber: number;
  private readonly _paymentDate: string;
  private readonly _periodType: PeriodType;
  private readonly _initialBalance: number;
  private readonly _interest: number;
  private readonly _amortization: number;
  private readonly _totalInsurance: number;
  private readonly _portes: number;
  private readonly _otherExpenses: number;
  private readonly _totalPayment: number;
  private readonly _finalBalance: number;
  private readonly _cashFlow: number;

  constructor(props: PaymentScheduleEntryProps) {
    this._id = props.id;
    this._simulationId = props.simulationId;
    this._installmentNumber = props.installmentNumber;
    this._paymentDate = props.paymentDate;
    this._periodType = props.periodType;
    this._initialBalance = props.initialBalance;
    this._interest = props.interest;
    this._amortization = props.amortization;
    this._totalInsurance = props.totalInsurance;
    this._portes = props.portes;
    this._otherExpenses = props.otherExpenses;
    this._totalPayment = props.totalPayment;
    this._finalBalance = props.finalBalance;
    this._cashFlow = props.cashFlow;
  }

  get id(): string {
    return this._id;
  }

  get simulationId(): string {
    return this._simulationId;
  }

  get installmentNumber(): number {
    return this._installmentNumber;
  }

  get paymentDate(): string {
    return this._paymentDate;
  }

  get periodType(): PeriodType {
    return this._periodType;
  }

  get initialBalance(): number {
    return this._initialBalance;
  }

  get interest(): number {
    return this._interest;
  }

  get amortization(): number {
    return this._amortization;
  }

  get totalInsurance(): number {
    return this._totalInsurance;
  }

  get portes(): number {
    return this._portes;
  }

  get otherExpenses(): number {
    return this._otherExpenses;
  }

  get totalPayment(): number {
    return this._totalPayment;
  }

  get finalBalance(): number {
    return this._finalBalance;
  }

  get cashFlow(): number {
    return this._cashFlow;
  }
}
