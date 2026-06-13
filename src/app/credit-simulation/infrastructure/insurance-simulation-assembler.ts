import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {InsuranceSimulation} from '../domain/model/insurance-simulation.entity';
import {InsuranceSimulationResource, InsuranceSimulationsResponse} from './insurance-simulations-response';

export class InsuranceSimulationAssembler
  implements BaseAssembler<InsuranceSimulation, InsuranceSimulationResource, InsuranceSimulationsResponse> {
  toEntityFromResource(resource: InsuranceSimulationResource): InsuranceSimulation {
    return new InsuranceSimulation({
      id: resource.id,
      simulationId: resource.simulation_id,
      insuranceTypeId: resource.tipo_seguro_id,
      monthlyRate: resource.tasa_mensual,
      baseCalculo: resource.base_calculo,
      applies: resource.applies
    });
  }

  toResourceFromEntity(entity: InsuranceSimulation): InsuranceSimulationResource {
    return {
      id: entity.id,
      simulation_id: entity.simulationId,
      tipo_seguro_id: entity.insuranceTypeId,
      tasa_mensual: entity.monthlyRate,
      base_calculo: entity.baseCalculo,
      applies: entity.applies
    };
  }

  toEntitiesFromResponse(response: InsuranceSimulationsResponse): InsuranceSimulation[] {
    return response.insurance_simulations.map(resource => this.toEntityFromResource(resource));
  }
}
