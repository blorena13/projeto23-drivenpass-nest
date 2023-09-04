import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { createUser } from "./factories/users-factory";
import { generateValidToken } from "./helpers/helpers";
import { CardFactory } from "./factories/card-factory";
import { faker } from "@faker-js/faker";
import { createNotes } from "./factories/notes-factory";
import { createCredentials } from "./factories/credentials-factory";
import * as request from 'supertest';
import * as bcrypt from "bcrypt";

describe('credentials tests', () => {
    let app: INestApplication;
    let prisma: PrismaService = new PrismaService();
    let jwt:JwtService=new JwtService({secret:process.env.JWT_SECRET})

    beforeEach(async ()=> {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
        .overrideProvider(PrismaService)
        .useValue(prisma)
        .compile();

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())
        await app.init();

       await prisma.credentials.deleteMany();
       await prisma.notes.deleteMany();
       await prisma.card.deleteMany();
       await prisma.user.deleteMany();
       
    })

    afterAll(async () => {
        await app.close();
        await prisma.$disconnect();
    });

    it('ERASE /erase => should clean db', async () => {

        const newUser = await createUser(prisma);
        const token = await generateValidToken(jwt, prisma, newUser);

        await createNotes(prisma, newUser.id);
        await createCredentials(prisma, newUser.id);

        await new CardFactory(prisma)
        .withTitle(faker.lorem.sentence())
        .withCardNumber("5590 2591 3912 2177")
        .withUsername(faker.person.firstName())
        .withSecurityCode("565")
        .withDate("13/11")
        .withPassword(faker.internet.password())
        .withIsVirtual(true)
        .withType("debito")
        .withUserId(newUser.id)
        .persist()

        const body = {
            password: (newUser.password)
        }

        await request(app.getHttpServer())
        .delete("/erase")
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .expect(HttpStatus.OK)

        const result = await prisma.user.findFirst({
            where: {id: newUser.id}
        });
        expect(result).toBe(null);

    })
})