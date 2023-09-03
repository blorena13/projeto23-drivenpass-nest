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

    it('POST /credentials => should create credentials', async () => {

        const newUser = await createUser(prisma);
        const token = await generateValidToken(jwt, prisma, newUser);
     
        const credentialDto: CreateCredentialDto = new CreateCredentialDto({
            title: faker.lorem.sentence(),
            url: faker.image.url(),
            name: faker.person.firstName(),
            password: faker.internet.password()
        });


        await request(app.getHttpServer())
        .post('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .send(credentialDto)
        .expect(HttpStatus.CREATED)

        const result = await prisma.credentials.findMany();
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            url: expect.any(String),
            name: expect.any(String),
            password: expect.any(String),
            userId: newUser.id
        })
    })

    it('POST /credentials => should should return 401', async () => {

        const newUser = await createUser(prisma);
        const token = await generateValidToken(jwt, prisma, newUser);
     
        const credentialDto: CreateCredentialDto = new CreateCredentialDto({
            title: faker.lorem.sentence(),
            url: faker.image.url(),
            name: faker.person.firstName(),
            password: faker.internet.password()
        });

        await createCredentials(prisma, newUser.id)

        await request(app.getHttpServer())
        .post('/credentials')
        .send(credentialDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it('GET /credentials => should return all user credentials', async () => {

        const Cryptr = require('cryptr');
        const cryptr = new Cryptr('myTotallySecretKey');

        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        
        await createCredentials(prisma, newUser.id)
        await createCredentials(prisma, newUser.id)
        

       const {body} = await request(app.getHttpServer())
       .get('/credentials')
       .set('Authorization', `Bearer ${token}`)
       .expect(HttpStatus.OK)
       expect(body).toHaveLength(2);
    })

    it('GET /credentials/:id => should return a specific user credentials', async () => {
        const Cryptr = require('cryptr');
        const cryptr = new Cryptr('myTotallySecretKey');

        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        const credentials = await createCredentials(prisma, newUser.id);

        const {body} = await request(app.getHttpServer())
        .get(`/credentials/${credentials.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        expect(body).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            url: expect.any(String),
            name: expect.any(String),
            password: cryptr.decrypt(credentials.password),
            userId: newUser.id
        })
    })

    it('GET /credentials/:id => should return 404 when try to get a not found id', async () => {
        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);

        await request(app.getHttpServer())
        .get('credentials/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND)
    })

    it('DELETE /credentials => should delete a specific user credentials', async () => {
        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        const credentials = await createCredentials(prisma, newUser.id);

        await request(app.getHttpServer())
        .delete(`/credentials/${credentials.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)

        const result = await prisma.credentials.findMany();
        expect(result).toHaveLength(0);
    })

    it('', async () => {

    })
})