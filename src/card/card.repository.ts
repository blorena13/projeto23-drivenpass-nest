import { Injectable } from "@nestjs/common";
import { CreateCardDto } from "./dto/create-card.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CardRepository {
    constructor(private readonly prisma: PrismaService) { }

 async  createCard(body: CreateCardDto, userId: number) {

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('myTotallySecretKey');

    return await this.prisma.card.create({
        data: {
            ...body, 
            securityCode: cryptr.encrypt(body.securityCode), 
            password: cryptr.encrypt(body.password),
            userId
        }
    })
  }

  getByTitle(title: string, userId: number) {
   return this.prisma.card.findFirst({
    where: {title, userId}
   })
  }

  async findAllByUserId(userId: number) {
    const cards = await this.prisma.card.findMany({
        where: {userId}
    });

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('myTotallySecretKey');

    const result = cards.map( card => {
        return {
            ...card,
            securityCode: cryptr.decrypt(card.securityCode),
            password: cryptr.decrypt(card.password)
        }
    })
    return result;
  }

  async findById(id: number) {
    const result = await this.prisma.card.findFirst({
        where: {id}
    })

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('myTotallySecretKey');

    return {
        ...result,
        securityCode: cryptr.decrypt(result.securityCode),
        password: cryptr.decrypt(result.password)
    }
  }

  deleteById(id: number) {
    return this.prisma.card.delete({
        where: {id}
    })
  }

  deleteByUserId(userId: number){
    return this.prisma.card.deleteMany({
        where: {userId}
    })
  }

}