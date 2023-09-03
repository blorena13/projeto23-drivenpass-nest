import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../src/prisma/prisma.service";

export async function createUser(prisma: PrismaService ,params: Partial<User> = {}): Promise<User>{
 const createPassword = params.password || "testeLore12*";
 const hashdPassword = bcrypt.hashSync(createPassword, 10)

 return prisma.user.create({
    data: {
        email: params.email || faker.internet.email(),
        password: hashdPassword
    }
 })
}