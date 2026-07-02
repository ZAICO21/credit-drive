import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import {
  InsuranceBaseCalculation,
  InsuranceRatePeriod,
  InsuranceType,
} from '../domain/model/insurance-type.entity';
import { InsuranceTypeResource, InsuranceTypesResponse } from './insurance-types-response';

export class InsuranceTypeAssembler implements BaseAssembler<
  InsuranceType,
  InsuranceTypeResource,
  InsuranceTypesResponse
> {
  toEntityFromResource(resource: InsuranceTypeResource): InsuranceType {
    return new InsuranceType({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      baseCalculo: resource.base_calculo,
      monthlyRate: resource.tasa_mensual,
      mandatory: resource.mandatory,
      status: resource.status,

      rateValue: resource.rate_value ?? resource.tasa_mensual,
      ratePeriod: (resource.rate_period ?? 'PERIODIC') as InsuranceRatePeriod,
      baseCalculation: (resource.base_calculation ??
        this.mapLegacyBaseCalculation(resource.base_calculo)) as InsuranceBaseCalculation,
    });
  }

  toResourceFromEntity(entity: InsuranceType): InsuranceTypeResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,

      base_calculo: entity.baseCalculo ?? this.mapBaseCalculationToLegacy(entity.baseCalculation),
      tasa_mensual: entity.monthlyRate,

      mandatory: entity.mandatory,
      status: entity.status,

      rate_value: entity.rateValue,
      rate_period: entity.ratePeriod,
      base_calculation: entity.baseCalculation,
    };
  }

  toEntitiesFromResponse(response: InsuranceTypesResponse): InsuranceType[] {
    return response.insurance_types.map((resource) => this.toEntityFromResource(resource));
  }

  private mapLegacyBaseCalculation(baseCalculo: string | null): InsuranceBaseCalculation {
    const normalized = (baseCalculo ?? '').trim().toUpperCase();

    if (normalized === 'VEHICULO') {
      return 'VEHICLE_PRICE';
    }

    if (normalized === 'MONTO_FINANCIADO') {
      return 'LOAN_AMOUNT';
    }

    if (normalized === 'FIJO') {
      return 'FIXED_AMOUNT';
    }

    return 'REGULAR_BALANCE';
  }

  private mapBaseCalculationToLegacy(baseCalculation: InsuranceBaseCalculation): string {
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
