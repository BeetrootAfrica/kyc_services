import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user-entity';


@Entity({name: "wallet"})
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  walletID: string;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @DeleteDateColumn()
  deletedDate: Date;
  @Column({ nullable: true })
  userID?: string;
  @Column({ nullable: true })
  walletName?: string;
  @Column({ nullable: true })
  walletAddress?: string;
  @Column({ nullable: true })
  currentBalance: number;
  @OneToMany(() => WalletTransactionEntity,
  (transactions: WalletTransactionEntity) => transactions.wallet,)
  transactions: WalletTransactionEntity[];
  @Column({unsigned: true})
  receiverUserId: number
  @OneToOne(type => UserEntity, (user) => user.wallet, {lazy: true, nullable: false})
  user:Promise<UserEntity>
}

@Entity({name: "wallet_transactions"})
export class WalletTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  walletTransactionID: string;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @DeleteDateColumn()
  deletedDate: Date;
  @Column({ nullable: true })
  walletName: string;
  @Column({ nullable: true })
  transactionNotes: string;
  @Column({ nullable: true })
  transactionStatus: string;
  @Column({ nullable: true })
  smartContractInvoked: boolean;
  @Column({ nullable: true })
  sendingWallet: string;
  @ManyToOne(() => WalletEntity, (wallet: WalletEntity) => wallet.transactions)
  wallet: WalletEntity;
  @Column({ nullable: true })
  receivingWallet: string;
  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  blockchainTransactionHash: string;
  @Column({ nullable: true })
  blockHash: string;
  @Column({ nullable: true })
  blockNumber: string;
  @Column({ nullable: true })
  cumulativeGasUsed: string;
  @Column({ nullable: true })
  gasUsed: string;
  @Column({ nullable: true })
  blockchainTransactionMessage: string;
  @Column({ nullable: true })
  contractAddress: string;
}
