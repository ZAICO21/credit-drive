import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { InsuranceSimulation } from '../domain/model/insurance-simulation.entity';
import {
  InsuranceBaseCalculation,
  InsuranceRatePeriod,
} from '../domain/model/insurance-type.entity';
import {
  InsuranceSimulationResource,
  InsuranceSimulationsResponse,
} from './insurance-simulations-response';

export class InsuranceSimulationAssembler implements BaseAssembler<
  InsuranceSimulation,
  InsuranceSimulationResource,
  InsuranceSimulationsResponse
> {
  toEntityFromResource(resource: InsuranceSimulationResource): InsuranceSimulation {
    return new InsuranceSimulation({
      id: resource.id,
      simulationId: resource.simulation_id,
      insuranceTypeId: resource.insurance_type_id ?? resource.tipo_seguro_id,

      monthlyRate: resource.tasa_mensual,
      baseCalculo: resource.base_calculo,
      applies: resource.applies,

      nameSnapshot: resource.name_snapshot ?? null,
      rateValue: resource.rate_value ?? resource.tasa_mensual,
      ratePeriod: (resource.rate_period ?? 'PERIODIC') as InsuranceRatePeriod,
      baseCalculation: (resource.base_calculation ??
        this.mapLegacyBaseCalculation(resource.base_calculo)) as InsuranceBaseCalculation,
    });
  }

  toResourceFromEntity(entity: InsuranceSimulation): InsuranceSimulationResource {
    return {
      id: entity.id,
      simulation_id: entity.simulationId,

      /**
       * Important:
       * tipo_seguro_id is still NOT NULL in your current DB,
       * so we must send it even though insurance_type_id is the new name.
       */
      tipo_seguro_id: entity.insuranceTypeId,
      insurance_type_id: entity.insuranceTypeId,

      tasa_mensual: entity.monthlyRate,
      base_calculo: entity.baseCalculo ?? this.mapBaseCalculationToLegacy(entity.baseCalculation),

      applies: entity.applies,

      name_snapshot: entity.nameSnapshot,
      rate_value: entity.rateValue,
      rate_period: entity.ratePeriod,
      base_calculation: entity.baseCalculation,
    };
  }

  toEntitiesFromResponse(response: InsuranceSimulationsResponse): InsuranceSimulation[] {
    return response.insurance_simulations.map((resource) => this.toEntityFromResource(resource));
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
