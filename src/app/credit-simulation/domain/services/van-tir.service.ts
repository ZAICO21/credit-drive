const TIR_BISECTION_ITERATIONS = 50;

/**
 * VAN/TIR/TCEA from the debtor's perspective, computed via bisection,
 * mirroring the report's PSeInt algorithm exactly.
 */
export class VanTirService {
  /** VAN = P - Σ CuotaTotal_t/(1+r)^t - VF/(1+r)^n */
  static computeVan(financedAmount: number, totalPayments: number[], futureValue: number, discountRate: number): number {
    let van = financedAmount;
    for (let t = 0; t < totalPayments.length; t++) {
      van -= totalPayments[t] / Math.pow(1 + discountRate, t + 1);
    }
    van -= futureValue / Math.pow(1 + discountRate, totalPayments.length);
    return van;
  }

  /** TIR: monthly rate that makes VAN = 0, found by bisection in [0.0001, 0.9999]. */
  static computeTir(financedAmount: number, totalPayments: number[], futureValue: number): number {
    let low = 0.0001;
    let high = 0.9999;
    let vanLow = this.computeVan(financedAmount, totalPayments, futureValue, low);

    let mid = (low + high) / 2;
    for (let iter = 0; iter < TIR_BISECTION_ITERATIONS; iter++) {
      mid = (low + high) / 2;
      const vanMid = this.computeVan(financedAmount, totalPayments, futureValue, mid);

      if (vanMid * vanLow < 0) {
        high = mid;
      } else {
        low = mid;
        vanLow = vanMid;
      }
    }

    return mid;
  }

  /** TCEA = (1 + TIR_mensual)^12 - 1 */
  static computeTcea(tirMonthly: number): number {
    return Math.pow(1 + tirMonthly, 12) - 1;
  }
}
