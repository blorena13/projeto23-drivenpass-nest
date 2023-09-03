import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import * as request from 'supertest';
import { PrismaService } from "../src/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { CreateUserDto } from "../src/users/dto/create-user.dto";
import { faker } from "@faker-js/faker";
import { createUser } from "./factories/users-factory";

describe('auth tests', () => {
    let app: INestApplication;
    let prisma: PrismaService = new PrismaService();

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

    it('POST /sign-up => should create user', async () => {

        const userDto: CreateUserDto = new CreateUserDto({
            email: faker.internet.email(),
            password: "testeLore13*"
        });

        await request(app.getHttpServer())
        .post('/users/sign-up')
        .send(userDto)
        .expect(HttpStatus.CREATED)
    })

    it('POST /sign-in => should login user', async () => {

        const userDto: CreateUserDto = new CreateUserDto({
            email: faker.internet.email(),
            password: "testeLore13*"
        });

        await createUser(prisma, userDto)


        const response = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send(userDto)
        .expect(HttpStatus.OK)

        expect(response.body.token).toBeDefined()
    })
})