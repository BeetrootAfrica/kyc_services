import { Not } from "typeorm";
import { AppDataSource } from "../../data/data-source/db-datasouce";
import { Either, Left, Right } from "../../utils/either";
import { BusinessEntity } from "../entity/business.entity";
import { DuplicateBusinessNameFailure } from "../entity/failures/duplicate-business-name";
import { Failure } from "../entity/failures/failure";

export type BusinessServiceParams = {
  notifyNewBusinessWasCreated: (businessId: number) => void;
};

export class BusinessService {
  constructor(private readonly params: BusinessServiceParams) {}

  private readonly _businessesTypormRepo =
    AppDataSource.getRepository(BusinessEntity);

  async saveBusiness(
    business: BusinessEntity
  ): Promise<Either<DuplicateBusinessNameFailure | Failure, BusinessEntity>> {
    try {
      business = Object.assign(new BusinessEntity(), business);
      business = await this._businessesTypormRepo.save(business);
      this.params.notifyNewBusinessWasCreated(business.businessId);
      return Right.create(business);
    } catch (error) {
      if (error.code == "ER_DUP_ENTRY") {
        return Left.create(
          new DuplicateBusinessNameFailure(business.businessName)
        );
      } else if (error.code?.length) {
        throw `TODO: ${error.code}`;
      }
      console.error("saveBusiness error:");
      console.error(error.toString());
      return Left.create(new Failure());
    }
  }


  async updateBusiness(
    businessId: number,
    updateData: Partial<Record<keyof BusinessEntity, any>>
  ): Promise<void> {
    await AppDataSource.manager.update(BusinessEntity, businessId, updateData);
  }


  async getAllBusinesses(params?: {
    exceptBusinessId?: number;
  }): Promise<BusinessEntity[]> {
    if (params?.exceptBusinessId == null) {
      return this._businessesTypormRepo.find();
    }
    return this._businessesTypormRepo.find({
      where: {
        businessId: Not(params.exceptBusinessId),
      },
    });
  }

  getBusinessByName(businessName: string): Promise<BusinessEntity> {
    return this._businessesTypormRepo.findOneBy({ businessName: businessName });
  }
  getBusinessByUserId(userId: number): Promise<BusinessEntity> {
    return this._businessesTypormRepo.findOneBy({ adminId: userId });
  }
}
