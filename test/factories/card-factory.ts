import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";

export class CardFactory {
    private title: string;
    private cardNumber: string;
    private userName: string;
    private securityCode: string;
    private date: string;
    private password: string;
    private isVirtual: boolean;
    private type: string;
    private userId: number;

    constructor(private readonly prisma: PrismaService) { }

    withTitle(title: string){
        this.title = title;
        return this;
    }

    withCardNumber(cardNumber: string){
        this.cardNumber = cardNumber;
        return this;
    }

    withUsername(username: string){
        this.userName = username;
        return this;
    }

    withSecurityCode(securityCode: string){
        this.securityCode = securityCode;
        return this;
    }

    withDate(date: string){
        this.date = date;
        return this;
    }

    withPassword(password: string){
        this.password = password;
        return this;
    }

    withIsVirtual(isVirtual: boolean){
        this.isVirtual = isVirtual;
        return this;
    }

    withType(type: string){
        this.type = type;
        return this;
    }

    withUserId(userId: number){
        this.userId = userId;
        return this;
    }

    build(){

        const Cryptr = require('cryptr');
        const cryptr = new Cryptr('myTotallySecretKey');

        return {
            title: this.title,
            cardNumber: this.cardNumber,
            name: this.userName,
            securityCode: cryptr.encrypt(this.securityCode),
            date: this.date,
            password: cryptr.encrypt(this.password),
            isVirtual: this.isVirtual,
            type: this.type,
            userId: this.userId
        }
    }

    async persist(){
        const card = this.build();
        return await this.prisma.card.create({
            data: card
        })
    }

}