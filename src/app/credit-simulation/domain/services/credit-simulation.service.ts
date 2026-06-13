import {CAPITALIZATION_PERIODS_PER_YEAR, CapitalizationType, GraceType, RateType} from '../model/credit-simulation.types';
import {RateConversionService} from './rate-conversion.service';
import {FrenchMethodService, SchedulePeriod} from './french-method.service';
import {VanTirService} from './van-tir.service';

export interface CreditSimulationInput {
  vehiclePrice: number;
  initialFeePercentage: number;
  termMonths: number;
  futureValuePercentage: number;
  rateType: RateType;
  interestRate: number;
  capitalization?: CapitalizationType;
  graceType: GraceType;
  gracePeriods: number;
  desgravamenMonthlyRatePercent: number;
  vehicularMonthlyRatePercent: number;
  portes: number;
}

export interface CreditSimulationResult {
  initialFeeAmount: number;
  financedAmount: number;
  futureValueAmount: number;
  monthlyEffectiveRate: number;
  baseQuota: number;
  schedule: SchedulePeriod[];
  van: number;
  tir: number;
  tcea: number;
}

/**
 * Orchestrates the full "Compra Inteligente" simulation: rate conversion,
 * balloon-payment schedule with grace periods, and the VAN/TIR/TCEA indicators.
 */
export class CreditSimulationService {
  static simulate(input: CreditSimulationInput): CreditSimulationResult {
    const initialFeeAmount = input.vehiclePrice * (input.initialFeePercentage / 100);
    const financedAmount = input.vehiclePrice - initialFeeAmount;
    const futureValueAmount = financedAmount * (input.futureValuePercentage / 100);

    const monthlyEffectiveRate = input.rateType === 'NOMINAL'
      ? RateConversionService.tnaToTem(input.interestRate, CAPITALIZATION_PERIODS_PER_YEAR[input.capitalization ?? 'MENSUAL'])
      : RateConversionService.teaToTem(input.interestRate);

    const {baseQuota, periods} = FrenchMethodService.buildSchedule({
      financedAmount,
      futureValue: futureValueAmount,
      termMonths: input.termMonths,
      graceType: input.graceType,
      gracePeriods: input.gracePeriods,
      monthlyEffectiveRate,
      vehiclePrice: input.vehiclePrice,
      desgravamenMonthlyRatePercent: input.desgravamenMonthlyRatePercent,
      vehicularMonthlyRatePercent: input.vehicularMonthlyRatePercent,
      portes: input.portes
    });

    const totalPayments = periods.map(period => period.totalPayment);
    const van = VanTirService.computeVan(financedAmount, totalPayments, futureValueAmount, monthlyEffectiveRate);
    const tir = VanTirService.computeTir(financedAmount, totalPayments, futureValueAmount);
    const tcea = VanTirService.computeTcea(tir);

    return {
      initialFeeAmount,
      financedAmount,
      futureValueAmount,
      monthlyEffectiveRate,
      baseQuota,
      schedule: periods,
      van,
      tir,
      tcea
    };
  }
}
