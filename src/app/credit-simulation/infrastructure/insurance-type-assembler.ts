import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {InsuranceType} from '../domain/model/insurance-type.entity';
import {InsuranceTypeResource, InsuranceTypesResponse} from './insurance-types-response';

export class InsuranceTypeAssembler
  implements BaseAssembler<InsuranceType, InsuranceTypeResource, InsuranceTypesResponse> {
  toEntityFromResource(resource: InsuranceTypeResource): InsuranceType {
    return new InsuranceType({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      baseCalculo: resource.base_calculo,
      monthlyRate: resource.tasa_mensual,
      mandatory: resource.mandatory,
      status: resource.status
    });
  }

  toResourceFromEntity(entity: InsuranceType): InsuranceTypeResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      base_calculo: entity.baseCalculo,
      tasa_mensual: entity.monthlyRate,
      mandatory: entity.mandatory,
      status: entity.status
    };
  }

  toEntitiesFromResponse(response: InsuranceTypesResponse): InsuranceType[] {
    return response.insurance_types.map(resource => this.toEntityFromResource(resource));
  }
}
