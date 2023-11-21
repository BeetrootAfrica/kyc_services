import { UserEntity } from "../../domain/entity/user-entity";
import { hashEncryption } from "../../utils/encryption-utils";
import { AsklessError } from "askless";

const kUserId = "userId";
const kCreatedAtMsSinceEpoch = "createdAtMsSinceEpoch";
const kFirstName = "firstName";
const kLastName = "lastName";
const kEmail = "email";
const kPhone = "phone";
const kStreetAddress = "streetAddress";
const kNeighbourhood = "neighbourhood";
const kCity = "city";
const kCountry = "country";
const kGender = "gender";
const kAge = "age";
const kRole = "role";
const kProfileImage = "profileImage";
const kImmeditiateNeeds = "immeditiateNeeds";
const kIdeals = "ideals";
const kSelfDescription = "selfDescription";
const kPlatformJoiningGoals = "platformJoiningGoals";
const kWalletAddress = "walletAddress";
const kOnlineStatus = "onlineStatus";
const kFacebookUrl = "facebookUrl";
const kXUrl = "xUrl";
const kLinkedInUrl = "linkedInUrl";
const kInstagramUrl = "instagramUrl";
const kAccountType = "accountType";
const kSpecialization = "specialization";
const kSpecialSkills = "specialSkills";
const kExpectedExperience = "expectedExperience";
const kTradingAs = "tradingAs";
const kPortfolioUrl = "portfolioUrl";
const kPassword = "password";

export interface UserOutputToClient {
  [kUserId]: number;
  [kCreatedAtMsSinceEpoch]: number;
  [kFirstName]: string;
  [kLastName]: string;
  [kEmail]: string;
  [kPhone]?: string;
  [kStreetAddress]?: string;
  [kNeighbourhood]?: string;
  [kCity]?: string;
  [kCountry]?: string;
  [kGender]?: string;
  [kAge]?: string;
  [kRole]?: string;
  [kProfileImage]?: string;
  [kImmeditiateNeeds]?: string;
  [kIdeals]?: string;
  [kSelfDescription]?: string;
  [kPlatformJoiningGoals]?: string;
  [kWalletAddress]?: string;
  [kOnlineStatus]?: boolean;
  [kFacebookUrl]?: string;
  [kXUrl]?: string;
  [kLinkedInUrl]?: string;
  [kInstagramUrl]?: string;
  [kAccountType]?: string;
  [kSpecialization]?: string;
  [kSpecialSkills]?: string;
  [kExpectedExperience]?: string;
  [kTradingAs]?: string;
  [kPortfolioUrl]?: string;
}

export interface UserBodyFromClient {
  [kUserId]: number;
  [kFirstName]: string;
  [kLastName]: string;
  [kEmail]: string;
  [kPhone]?: string;
  [kStreetAddress]?: string;
  [kNeighbourhood]?: string;
  [kCity]?: string;
  [kCountry]?: string;
  [kGender]?: string;
  [kAge]?: string;
  [kRole]?: string;
  [kProfileImage]?: string;
  [kImmeditiateNeeds]?: string;
  [kIdeals]?: string;
  [kSelfDescription]?: string;
  [kPlatformJoiningGoals]?: string;
  [kWalletAddress]?: string;
  [kOnlineStatus]?: boolean;
  [kFacebookUrl]?: string;
  [kXUrl]?: string;
  [kLinkedInUrl]?: string;
  [kInstagramUrl]?: string;
  [kAccountType]?: string;
  [kSpecialization]?: string;
  [kSpecialSkills]?: string;
  [kExpectedExperience]?: string;
  [kTradingAs]?: string;
  [kPortfolioUrl]?: string;
  [kPassword]: string;
}

export class UserModel extends UserEntity {
  output(): UserOutputToClient {
    return {
      [kUserId]: this.userId,
      [kFirstName]: this.firstName,
      [kLastName]: this.lastName,
      [kEmail]: this.email,
      [kPhone]: this.phone,
      [kStreetAddress]: this.streetAddress,
      [kNeighbourhood]: this.neighbourhood,
      [kCity]: this.city,
      [kCountry]: this.country,
      [kGender]: this.gender,
      [kAge]: this.age,
      [kRole]: this.role,
      [kProfileImage]: this.profileImage,
      [kImmeditiateNeeds]: this.immeditiateNeeds,
      [kIdeals]: this.ideals,
      [kSelfDescription]: this.selfDescription,
      [kPlatformJoiningGoals]: this.platformJoiningGoals,
      [kWalletAddress]: this.walletAddress,
      [kOnlineStatus]: this.onlineStatus,
      [kFacebookUrl]: this.facebookUrl,
      [kXUrl]: this.xUrl,
      [kLinkedInUrl]: this.linkedInUrl,
      [kInstagramUrl]: this.instagramUrl,
      [kAccountType]: this.accountType,
      [kSpecialization]: this.specialization,
      [kSpecialSkills]: this.specialSkills,
      [kExpectedExperience]: this.expectedExperience,
      [kTradingAs]: this.tradingAs,
      [kPortfolioUrl]: this.portfolioUrl,
      [kCreatedAtMsSinceEpoch]: this.createdAt.getTime(),
    };
  }

  static toClient(entity: UserEntity): UserOutputToClient {
    return Object.assign(new UserModel(), entity).output();
  }

  static async fromBody(data: UserBodyFromClient): Promise<UserModel> {
    if (UserModel.invalid(data)) {
      throw new AsklessError({
        code: "BAD_REQUEST",
        description: UserModel.validationError(data),
      });
    }
    const res = new UserModel();
    res.userId = data.userId;
    res.firstName = data.firstName;
    res.lastName = data.lastName;
    res.email = data.email;
    res.phone = data.phone;
    res.streetAddress = data.streetAddress;
    res.neighbourhood = data.neighbourhood;
    res.city = data.city;
    res.country = data.country;
    res.gender = data.gender;
    res.age = data.age;
    res.role = data.role;
    res.profileImage = data.profileImage;
    res.immeditiateNeeds = data.immeditiateNeeds;
    res.ideals = data.ideals;
    res.selfDescription = data.selfDescription;
    res.platformJoiningGoals = data.platformJoiningGoals;
    res.walletAddress = data.walletAddress;
    res.onlineStatus = data.onlineStatus;
    res.facebookUrl = data.facebookUrl;
    res.xUrl = data.xUrl;
    res.linkedInUrl = data.linkedInUrl;
    res.instagramUrl = data.instagramUrl;
    res.accountType = data.accountType;
    res.specialization = data.specialization;
    res.specialSkills = data.specialSkills;
    res.expectedExperience = data.expectedExperience;
    res.tradingAs = data.tradingAs;
    res.portfolioUrl = data.portfolioUrl;
    res.passwordHash = await hashEncryption(data.password);
    return res;
  }

  private static invalid(data: UserBodyFromClient): boolean {
    return Boolean(UserModel.validationError(data)?.length);
  }

  private static validationError(data: UserBodyFromClient): string | null {
    const separator = "; ";
    let errors = "";
    if (!data.firstName?.length) {
      errors += `Missing '${kFirstName}'${separator}`;
    }
    if (!data.lastName?.length) {
      errors += `Missing '${kLastName}'${separator}`;
    }
    if (!data.email?.length) {
      errors += `Missing '${kEmail}'${separator}`;
    }
    if (!data.password?.length) {
      errors += `Missing '${kPassword}'${separator}`;
    }
    if (errors?.length) {
      console.error(errors);
    }
    return errors.length ? errors.substring(0, errors.length - separator.length) : null;
  }

  static fromEntity(entity: UserEntity): UserModel {
    return Object.assign(new UserModel(), entity);
  }

  static fromEntityList(users: UserEntity[]): UserModel[] {
    return users.map((u) => UserModel.fromEntity(u));
  }
}
