import {RateConversionService} from './rate-conversion.service';

describe('RateConversionService', () => {
  it('converts TEA 12% to TEM (matches simulation #1 in db.json: 0.9489%)', () => {
    const tem = RateConversionService.teaToTem(12);
    expect(tem * 100).toBeCloseTo(0.9489, 4);
  });

  it('converts TNA 9% with monthly capitalization to TEM (matches simulation #2 in db.json: 0.7500%)', () => {
    const tem = RateConversionService.tnaToTem(9, 12);
    expect(tem * 100).toBeCloseTo(0.75, 4);
  });

  it('converts TEA 14.5% to TEM (Caso 1 del informe: TEM aproximada 1.13%)', () => {
    const tem = RateConversionService.teaToTem(14.5);
    expect(tem * 100).toBeCloseTo(1.13, 1);
  });

  it('round-trips TEM back to TEA', () => {
    const tem = RateConversionService.teaToTem(12);
    const tea = RateConversionService.temToTea(tem);
    expect(tea * 100).toBeCloseTo(12, 6);
  });
});
