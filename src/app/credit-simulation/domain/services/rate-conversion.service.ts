/**
 * Pure interest-rate conversion formulas (Marco conceptual, section 3 of the report).
 * All "Percent" inputs are expressed as percentages (e.g. 14.5 for 14.5%), matching
 * how rates are captured from the simulation form.
 */
export class RateConversionService {
  /** TEA -> TEM: TEP = (1 + TEA)^(1/12) - 1 */
  static teaToTem(teaPercent: number): number {
    return Math.pow(1 + teaPercent / 100, 1 / 12) - 1;
  }

  /** TNA con capitalización -> TEM: TEM = (1 + TNA/m)^(m/12) - 1 */
  static tnaToTem(tnaPercent: number, capitalizationPeriodsPerYear: number): number {
    return Math.pow(1 + (tnaPercent / 100) / capitalizationPeriodsPerYear, capitalizationPeriodsPerYear / 12) - 1;
  }

  /** TEM -> TEA: TEA = (1 + TEM)^12 - 1 */
  static temToTea(tem: number): number {
    return Math.pow(1 + tem, 12) - 1;
  }

  /** General effective-rate conversion between periods: TEP2 = (1 + TEP1)^(n2/n1) - 1 */
  static convertEffectiveRate(rate: number, fromPeriodsPerYear: number, toPeriodsPerYear: number): number {
    return Math.pow(1 + rate, toPeriodsPerYear / fromPeriodsPerYear) - 1;
  }
}
