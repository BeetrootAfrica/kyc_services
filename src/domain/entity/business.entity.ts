import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn } from "typeorm";
import { UserEntity } from "./user-entity";
import { WalletEntity } from "./wallet.entity";

@Entity()
export class BusinessEntity {
  @PrimaryGeneratedColumn('uuid')
  businessId :  number;

  @CreateDateColumn()
  createdAt: Date

  @Column()
  adminId: number;
  @OneToOne(() => UserEntity)
  @JoinColumn()
  admin: UserEntity
  @Column()
  shortTermGoals: string;
  @Column()
  longTermGoals: string;
  @Column()
  motto: string;
  @Column()
  operationsCountry: string;
  @Column()
  operationsCity: string;
  @Column()
  targetedCountries: string;
  @Column()
  targetedCities: string;
  @Column()
  businessName: string;
  @Column()
  streetAddress: string;
  @Column()
  gvtIssuedBusinessRegistraID: string;
  @Column()
  specialization: string;
  @Column()
  tradeSector : string;
  @Column()
  rating: string;
  @Column()
  searchTerm: string;
  @Column()
  public logoUrl?: string;
  @Column()
  public mainBannerImageUrl: string;
  @Column()
  onlineStatus: string;
  @Column()
  tradingAs: string;
  @Column()
  walletAddress: string;
  @JoinColumn({ name: 'wallet' })
  @OneToOne(() => WalletEntity)
  wallet: WalletEntity
}

