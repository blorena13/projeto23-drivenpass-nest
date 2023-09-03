import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service";
import * as request from 'supertest';
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { JwtService } from "@nestjs/jwt";
import { CreateCredentialDto } from "../src/credentials/dto/create-credential.dto";
import { faker, fakerKA_GE } from "@faker-js/faker";
import { generateValidToken } from "./helpers/helpers";
import { createUser } from "./factories/users-factory";
import { createCredentials } from "./factories/credentials-factory";
import { CreateCardDto } from "../src/card/dto/create-card.dto";
import { CardFactory } from "./factories/card-factory";

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

    it('POST /cards => should create card', async () => {

        const newUser = await createUser(prisma);
        const token = await generateValidToken(jwt, prisma, newUser);
     
        const cardDto: CreateCardDto = new CreateCardDto({
            title: faker.lorem.sentence(),
            cardNumber: "5590 2591 3912 2177",
            name: faker.person.firstName(),
            securityCode: "565",
            date: "12/02",
            password: faker.internet.password(),
            isVirtual: true,
            type: "credito"
        });


        await request(app.getHttpServer())
        .post('/card')
        .set('Authorization', `Bearer ${token}`)
        .send(cardDto)
        .expect(HttpStatus.CREATED)

        const result = await prisma.card.findMany();
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            cardNumber: expect.any(String),
            name: expect.any(String),
            securityCode: expect.any(String),
            date: expect.any(String),
            password: expect.any(String),
            isVirtual: expect.any(Boolean),
            type: expect.any(String),
            userId: newUser.id
        })
    })

    it('POST /card => should should return 401', async () => {

        const newUser = await createUser(prisma);
        const token = await generateValidToken(jwt, prisma, newUser);
     
        const cardDto: CreateCardDto = new CreateCardDto({
            title: faker.lorem.sentence(),
            cardNumber: "5590 2591 3912 2177",
            name: faker.person.firstName(),
            securityCode: "565",
            date: "12/02",
            password: faker.internet.password(),
            isVirtual: true,
            type: "credito"
        });


        await request(app.getHttpServer())
        .post('/card')
        .send(cardDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it('GET /card => should return all user card', async () => {

        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        
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

        await new CardFactory(prisma)
        .withTitle("olaaa taylor sz")
        .withCardNumber("5590 2591 3912 2177")
        .withUsername(faker.person.firstName())
        .withSecurityCode("565")
        .withDate("13/11")
        .withPassword(faker.internet.password())
        .withIsVirtual(true)
        .withType("debito")
        .withUserId(newUser.id)
        .persist()


       const {body} = await request(app.getHttpServer())
       .get('/card')
       .set('Authorization', `Bearer ${token}`)
       .expect(HttpStatus.OK)
       expect(body).toHaveLength(2);
    })

    it('GET /card/:id => should return a specific user card', async () => {
        const Cryptr = require('cryptr');
        const cryptr = new Cryptr('myTotallySecretKey');

        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        
        const card = await new CardFactory(prisma)
        .withTitle("olaaa taylor sz")
        .withCardNumber("5590 2591 3912 2177")
        .withUsername(faker.person.firstName())
        .withSecurityCode("565")
        .withDate("13/11")
        .withPassword(faker.internet.password())
        .withIsVirtual(true)
        .withType("debito")
        .withUserId(newUser.id)
        .persist()


        const {body} = await request(app.getHttpServer())
        .get(`/card/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        expect(body).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            cardNumber: expect.any(String),
            name: expect.any(String),
            securityCode: cryptr.decrypt(card.securityCode),
            date: expect.any(String),
            password: cryptr.decrypt(card.password),
            isVirtual: expect.any(Boolean),
            type: expect.any(String),
            userId: newUser.id
        })
    })

    it('GET /card/:id => should return 404 when try to get a not found id', async () => {
        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);

        await request(app.getHttpServer())
        .get('card/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND)
    })

    it('DELETE /card => should delete a specific user card', async () => {
        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        
        const card = await new CardFactory(prisma)
        .withTitle("olaaa taylor sz")
        .withCardNumber("5590 2591 3912 2177")
        .withUsername(faker.person.firstName())
        .withSecurityCode("565")
        .withDate("13/11")
        .withPassword(faker.internet.password())
        .withIsVirtual(true)
        .withType("debito")
        .withUserId(newUser.id)
        .persist()

        await request(app.getHttpServer())
        .delete(`/card/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)

        const result = await prisma.card.findMany();
        expect(result).toHaveLength(0);
    })

    it('', async () => {

    })
})