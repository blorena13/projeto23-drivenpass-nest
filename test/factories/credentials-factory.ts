import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";

export async function createCredentials(prisma: PrismaService, userId: number) {

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('myTotallySecretKey');

    return prisma.credentials.create({
        data: {
            title: faker.lorem.sentence(),
            url: faker.image.url(),
            name: faker.person.firstName(),
            password: cryptr.encrypt(faker.internet.password()),
            userId
        }
    })

}

// export class CredentialsFactory {
//     private title: string;
//     private url: string;
//     private name: string;
//     private password: string;

//     constructor(private readonly prisma: PrismaService) { }

//     withTitle(title: string){
//         this.title = title;
//         return this;
//     }

//     withUrl(url: string){
//         this.url = url;
//         return this;
//     }

//     withUsername(name: string){
//         this.name = name;
//         return this;
//     }

//     withPassword(password: string){
//         this.password = password;
//         return this;
//     }

//     build(id: number){
//         return {
//             title: this.title,
//             url: this.url,
//             name: this.name,
//             password: this.password,
//             userId: id
//         }
//     }

//     async persist(id: number){
//         const credential = this.build(id);
//         return await this.prisma.credentials.create({
//             data: credential
//         })
//     }
//}