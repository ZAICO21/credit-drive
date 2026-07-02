import {
  CAPITALIZATION_PERIODS_PER_YEAR,
  CapitalizationType,
} from '../model/credit-simulation.types';

/**
 * Conversión de tasas para el modelo de Compra Inteligente.
 *
 * Convención:
 * - Las tasas que vienen del formulario entran como porcentaje.
 *   Ejemplo: 14.5 significa 14.5%.
 * - Las tasas que se usan para cálculo salen como decimal.
 *   Ejemplo: 0.01134 significa 1.134%.
 */
export class RateConversionService {
  static percentToDecimal(percent: number): number {
    return percent / 100;
  }

  static decimalToPercent(decimal: number): number {
    return decimal * 100;
  }

  /**
   * TEA porcentual a tasa efectiva del periodo.
   *
   * Para meses ordinarios:
   * paymentFrequencyDays = 30
   * daysPerYear = 360
   */
  static effectiveAnnualToPeriod(
    teaPercent: number,
    paymentFrequencyDays = 30,
    daysPerYear = 360,
  ): number {
    const tea = this.percentToDecimal(teaPercent);
    return Math.pow(1 + tea, paymentFrequencyDays / daysPerYear) - 1;
  }

  /**
   * TNA porcentual a TEA decimal.
   *
   * TEA = (1 + TNA/m)^m - 1
   */
  static nominalAnnualToEffectiveAnnual(
    tnaPercent: number,
    capitalization: CapitalizationType = 'MENSUAL',
  ): number {
    const nominalRate = this.percentToDecimal(tnaPercent);
    const periodsPerYear = CAPITALIZATION_PERIODS_PER_YEAR[capitalization];

    return Math.pow(1 + nominalRate / periodsPerYear, periodsPerYear) - 1;
  }

  /**
   * TNA porcentual a tasa efectiva del periodo.
   */
  static nominalAnnualToPeriod(
    tnaPercent: number,
    capitalization: CapitalizationType = 'MENSUAL',
    paymentFrequencyDays = 30,
    daysPerYear = 360,
  ): number {
    const teaDecimal = this.nominalAnnualToEffectiveAnnual(tnaPercent, capitalization);

    return Math.pow(1 + teaDecimal, paymentFrequencyDays / daysPerYear) - 1;
  }

  /**
   * Tasa efectiva del periodo a TEA decimal.
   */
  static periodToEffectiveAnnual(
    periodRate: number,
    paymentFrequencyDays = 30,
    daysPerYear = 360,
  ): number {
    return Math.pow(1 + periodRate, daysPerYear / paymentFrequencyDays) - 1;
  }

  /**
   * Compatibilidad con tu código anterior:
   * TEA porcentual a TEM decimal.
   */
  static teaToTem(teaPercent: number): number {
    return this.effectiveAnnualToPeriod(teaPercent, 30, 360);
  }

  /**
   * Compatibilidad con tu código anterior:
   * TNA porcentual a TEM decimal.
   */
  static tnaToTem(tnaPercent: number, capitalizationPeriodsPerYear: number): number {
    const nominalRate = this.percentToDecimal(tnaPercent);
    const teaDecimal =
      Math.pow(1 + nominalRate / capitalizationPeriodsPerYear, capitalizationPeriodsPerYear) - 1;

    return Math.pow(1 + teaDecimal, 30 / 360) - 1;
  }

  /**
   * Compatibilidad con tu código anterior:
   * TEM decimal a TEA decimal.
   */
  static temToTea(tem: number): number {
    return this.periodToEffectiveAnnual(tem, 30, 360);
  }
}
