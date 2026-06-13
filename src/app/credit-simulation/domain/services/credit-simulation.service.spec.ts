import {CreditSimulationService} from './credit-simulation.service';
import {VanTirService} from './van-tir.service';

describe('CreditSimulationService', () => {
  describe('Caso 1: Crédito en Soles con TEA y Gracia Parcial (S/ 85,000, 36 meses)', () => {
    const result = CreditSimulationService.simulate({
      vehiclePrice: 85000,
      initialFeePercentage: 20,
      termMonths: 36,
      futureValuePercentage: 40,
      rateType: 'EFECTIVA',
      interestRate: 14.5,
      graceType: 'PARCIAL',
      gracePeriods: 2,
      desgravamenMonthlyRatePercent: 0.05,
      vehicularMonthlyRatePercent: 0.30,
      portes: 10
    });

    it('computes financed amount and future value (datos intermedios)', () => {
      expect(result.financedAmount).toBeCloseTo(68000, 2);
      expect(result.futureValueAmount).toBeCloseTo(27200, 2);
    });

    it('computes the base quota (~S/ 1,761.71)', () => {
      expect(result.baseQuota).toBeCloseTo(1761.71, 0);
    });

    it('produces 36 schedule periods, with periods 1-2 as partial grace', () => {
      expect(result.schedule).toHaveLength(36);
      expect(result.schedule[0].periodType).toBe('GRACIA_PARCIAL');
      expect(result.schedule[1].periodType).toBe('GRACIA_PARCIAL');
      expect(result.schedule[0].amortization).toBe(0);
      expect(result.schedule[0].finalBalance).toBeCloseTo(68000, 2);
    });

    it('keeps the balance constant during partial grace and applies insurances/portes', () => {
      const [p1, p2] = result.schedule;
      expect(p1.insuranceVehicular).toBeCloseTo(255, 2);
      expect(p1.portes).toBe(10);
      expect(p1.totalPayment).toBeCloseTo(p1.interest + p1.insuranceDesgravamen + p1.insuranceVehicular + p1.portes, 6);
      expect(p2.initialBalance).toBeCloseTo(p1.finalBalance, 2);
    });

    it('settles the balloon payment exactly at the future value on the last period', () => {
      const last = result.schedule[35];
      expect(last.isBalloonPayment).toBe(true);
      expect(last.finalBalance).toBeCloseTo(27200, 2);
    });

    it('TIR is the rate that zeroes the VAN, and TCEA annualizes it', () => {
      expect(result.tir).toBeGreaterThan(0);
      expect(result.tir).toBeLessThan(1);
      expect(result.tcea).toBeCloseTo(Math.pow(1 + result.tir, 12) - 1, 6);

      const totalPayments = result.schedule.map(p => p.totalPayment);
      const vanAtTir = VanTirService.computeVan(
        result.financedAmount, totalPayments, result.futureValueAmount, result.tir
      );
      expect(vanAtTir).toBeCloseTo(0, 1);
    });
  });

  describe('Caso 2: Crédito en Dólares con TNA y Gracia Total ($ 32,000, 48 meses)', () => {
    const result = CreditSimulationService.simulate({
      vehiclePrice: 32000,
      initialFeePercentage: 15,
      termMonths: 48,
      futureValuePercentage: 45,
      rateType: 'NOMINAL',
      interestRate: 12,
      capitalization: 'MENSUAL',
      graceType: 'TOTAL',
      gracePeriods: 3,
      desgravamenMonthlyRatePercent: 0.04,
      vehicularMonthlyRatePercent: 0.25,
      portes: 8
    });

    it('computes financed amount, future value and TEM (datos intermedios)', () => {
      expect(result.financedAmount).toBeCloseTo(27200, 2);
      expect(result.futureValueAmount).toBeCloseTo(12240, 2);
      expect(result.monthlyEffectiveRate * 100).toBeCloseTo(1.0, 6);
    });

    it('capitalizes interest during total grace and matches the report balances exactly', () => {
      const [p1, p2, p3] = result.schedule;
      expect(p1.periodType).toBe('GRACIA_TOTAL');
      expect(p1.totalPayment).toBe(0);
      expect(p1.finalBalance).toBeCloseTo(27472.0, 2);
      expect(p2.finalBalance).toBeCloseTo(27746.72, 2);
      expect(p3.finalBalance).toBeCloseTo(28024.19, 2);
    });

    it('computes the base quota over the capitalized balance (~$ 559.70)', () => {
      expect(result.baseQuota).toBeCloseTo(559.70, 0);
    });

    it('produces 48 schedule periods and settles the balloon payment at the future value', () => {
      expect(result.schedule).toHaveLength(48);
      const last = result.schedule[47];
      expect(last.isBalloonPayment).toBe(true);
      expect(last.finalBalance).toBeCloseTo(12240, 2);
    });

    it('TIR is the rate that zeroes the VAN, and TCEA annualizes it', () => {
      expect(result.tir).toBeGreaterThan(0);
      expect(result.tir).toBeLessThan(1);
      expect(result.tcea).toBeCloseTo(Math.pow(1 + result.tir, 12) - 1, 6);

      const totalPayments = result.schedule.map(p => p.totalPayment);
      const vanAtTir = VanTirService.computeVan(
        result.financedAmount, totalPayments, result.futureValueAmount, result.tir
      );
      expect(vanAtTir).toBeCloseTo(0, 1);
    });
  });
});
