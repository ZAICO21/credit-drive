import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {CapitalizationType, GraceType, RateType} from './credit-simulation.types';

export type CurrencyCode = 'PEN' | 'USD';

export interface SimulationProps {
  id: string;
  clientId: string;
  vehicleId: string;
  userId: string;
  vehiclePrice: number;
  currency: CurrencyCode;
  initialFeePercentage: number;
  initialFeeAmount: number;
  financedAmount: number;
  termMonths: number;
  futureValuePercentage: number;
  futureValueAmount: number;
  rateType: RateType;
  interestRate: number;
  capitalization: CapitalizationType | null;
  monthlyEffectiveRate: number;
  graceType: GraceType;
  gracePeriod: number;
  portes: number;
  baseQuota: number;
  tcea: number;
  van: number;
  tir: number;
  disbursementDate: string;
  registrationDate: string;
}

/**
 * Aggregate root for a "Compra Inteligente" credit simulation: captures the
 * input parameters plus the calculated indicators (cuota base, TCEA, VAN, TIR).
 * Its payment schedule and related insurance/expense lines are separate
 * collections joined by `simulationId` (Persistencia Opción A).
 */
export class Simulation implements BaseEntity {
  private readonly _id: string;
  private readonly _clientId: string;
  private readonly _vehicleId: string;
  private readonly _userId: string;
  private readonly _vehiclePrice: number;
  private readonly _currency: CurrencyCode;
  private readonly _initialFeePercentage: number;
  private readonly _initialFeeAmount: number;
  private readonly _financedAmount: number;
  private readonly _termMonths: number;
  private readonly _futureValuePercentage: number;
  private readonly _futureValueAmount: number;
  private readonly _rateType: RateType;
  private readonly _interestRate: number;
  private readonly _capitalization: CapitalizationType | null;
  private readonly _monthlyEffectiveRate: number;
  private readonly _graceType: GraceType;
  private readonly _gracePeriod: number;
  private readonly _portes: number;
  private readonly _baseQuota: number;
  private readonly _tcea: number;
  private readonly _van: number;
  private readonly _tir: number;
  private readonly _disbursementDate: string;
  private readonly _registrationDate: string;

  constructor(props: SimulationProps) {
    this._id = props.id;
    this._clientId = props.clientId;
    this._vehicleId = props.vehicleId;
    this._userId = props.userId;
    this._vehiclePrice = props.vehiclePrice;
    this._currency = props.currency;
    this._initialFeePercentage = props.initialFeePercentage;
    this._initialFeeAmount = props.initialFeeAmount;
    this._financedAmount = props.financedAmount;
    this._termMonths = props.termMonths;
    this._futureValuePercentage = props.futureValuePercentage;
    this._futureValueAmount = props.futureValueAmount;
    this._rateType = props.rateType;
    this._interestRate = props.interestRate;
    this._capitalization = props.capitalization;
    this._monthlyEffectiveRate = props.monthlyEffectiveRate;
    this._graceType = props.graceType;
    this._gracePeriod = props.gracePeriod;
    this._portes = props.portes;
    this._baseQuota = props.baseQuota;
    this._tcea = props.tcea;
    this._van = props.van;
    this._tir = props.tir;
    this._disbursementDate = props.disbursementDate;
    this._registrationDate = props.registrationDate;
  }

  get id(): string {
    return this._id;
  }

  get clientId(): string {
    return this._clientId;
  }

  get vehicleId(): string {
    return this._vehicleId;
  }

  get userId(): string {
    return this._userId;
  }

  get vehiclePrice(): number {
    return this._vehiclePrice;
  }

  get currency(): CurrencyCode {
    return this._currency;
  }

  get initialFeePercentage(): number {
    return this._initialFeePercentage;
  }

  get initialFeeAmount(): number {
    return this._initialFeeAmount;
  }

  get financedAmount(): number {
    return this._financedAmount;
  }

  get termMonths(): number {
    return this._termMonths;
  }

  get futureValuePercentage(): number {
    return this._futureValuePercentage;
  }

  get futureValueAmount(): number {
    return this._futureValueAmount;
  }

  get rateType(): RateType {
    return this._rateType;
  }

  get interestRate(): number {
    return this._interestRate;
  }

  get capitalization(): CapitalizationType | null {
    return this._capitalization;
  }

  get monthlyEffectiveRate(): number {
    return this._monthlyEffectiveRate;
  }

  get graceType(): GraceType {
    return this._graceType;
  }

  get gracePeriod(): number {
    return this._gracePeriod;
  }

  get portes(): number {
    return this._portes;
  }

  get baseQuota(): number {
    return this._baseQuota;
  }

  get tcea(): number {
    return this._tcea;
  }

  get van(): number {
    return this._van;
  }

  get tir(): number {
    return this._tir;
  }

  get disbursementDate(): string {
    return this._disbursementDate;
  }

  get registrationDate(): string {
    return this._registrationDate;
  }
}
