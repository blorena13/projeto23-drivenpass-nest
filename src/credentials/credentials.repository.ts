import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCredentialDto } from "./dto/create-credential.dto";
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsRepository {
  
 constructor( private readonly prisma: PrismaService) { }

 createCredentials(body: CreateCredentialDto, userId: number) {
  
  const Cryptr = require('cryptr');
  const cryptr = new Cryptr('myTotallySecretKey');

    return this.prisma.credentials.create({
        data: {...body, password: cryptr.encrypt(body.password), userId}
    })
  }

  async findAllByUserId(userId: number) {
    const credentials = await this.prisma.credentials.findMany({
        where: {userId}
    })

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('myTotallySecretKey');

    const result = credentials.map(credential => {
     return {
      ...credential,
      password: cryptr.decrypt(credential.password)
     }
    })
    return result;
  }

  getByTitle(title: string, userId: number){
    return this.prisma.credentials.findFirst({
        where: {
            title,
            userId
        }
    })
  }

  async findById(id: number) {
    const result = await this.prisma.credentials.findFirst({
      where: {id}
    })

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('myTotallySecretKey');

    
     return {
      ...result,
      password: cryptr.decrypt(result.password)
     }
  }

  deleteById(id: number) {
    return this.prisma.credentials.delete({
      where: {id}
    })
  }

}