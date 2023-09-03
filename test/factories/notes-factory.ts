import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";

export async function createNotes(prisma: PrismaService, userId: number){
    return prisma.notes.create({
        data: {
            title: faker.lorem.sentence(),
            notes: faker.lorem.text(),
            userId
        }
    })
}