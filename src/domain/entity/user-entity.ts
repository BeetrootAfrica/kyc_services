import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, OneToOne} from "typeorm"
import {TextMessageEntity} from "./text-message-entity";
import {  WalletEntity } from "./wallet.entity";

@Entity({name: "user"})
export class UserEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    userId: number

    @CreateDateColumn()
    createdAt: Date

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({unique: true})
    email: string

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    streetAddress: string;

    @Column({ nullable: true })
    neighbourhood: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    age: string;
    
    @Column({ nullable: true })
    role: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ nullable: true })
    immeditiateNeeds: string;
    
    @Column({ nullable: true })
    ideals: string;

    @Column({ nullable: true })
    selfDescription: string;

    @Column({ nullable: true })
    platformJoiningGoals: string; 

    @Column({ nullable: true })
    walletAddress: string;

    @Column({ nullable: true })
    onlineStatus: boolean;

    @Column({ nullable: true })
    facebookUrl: string;

    @Column({ nullable: true })
    xUrl: string;

    @Column({ nullable: true })
    linkedInUrl: string;

    @Column({ nullable: true })
    instagramUrl: string;

    @Column({ nullable: true })
    accountType: string;

    @Column({ nullable: true })
    specialization: string;

    @Column({ nullable: true })
    specialSkills?: string;

    @Column({nullable: true})
    expectedExperience: string;
    
    @Column({ nullable: true })
    tradingAs: string;

    @Column({ nullable: true })
    portfolioUrl: string;

    @Column({name: "password_hash"})
    passwordHash: string

    @Column({name: "refresh_token_hash", nullable: true})
    refreshTokenHash?: string

    @OneToMany(type => TextMessageEntity, (message) => message.sender, {lazy: true})
    messagesSent:Promise<TextMessageEntity[]>

    @OneToMany(type => TextMessageEntity, (message) => message.receiver, {lazy: true})
    messagesReceived:Promise<UserEntity[]>

    @OneToOne(type => WalletEntity, (wallet) => wallet.user, {lazy: true})
    wallet:Promise<WalletEntity>

}

