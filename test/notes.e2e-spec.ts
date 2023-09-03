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
import { CreateNoteDto } from "../src/notes/dto/create-note.dto";
import { createNotes } from "./factories/notes-factory";

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

    it('POST /notes => should create notes', async () => {

        const newUser = await createUser(prisma);
        const token = await generateValidToken(jwt, prisma, newUser);
     
        const notesDto: CreateNoteDto = new CreateNoteDto({
            title: faker.lorem.sentence(),
            notes: faker.lorem.text()
        });


        await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(notesDto)
        .expect(HttpStatus.CREATED)

        const result = await prisma.notes.findMany();
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            notes: expect.any(String),
            userId: newUser.id
        })
    })

    it('POST /notes => should should return 401', async () => {

        const newUser = await createUser(prisma);
        const token = await generateValidToken(jwt, prisma, newUser);
     
        const notesDto: CreateNoteDto = new CreateNoteDto({
            title: faker.lorem.sentence(),
            notes: faker.lorem.text()
        });


        await createNotes(prisma, newUser.id)

        await request(app.getHttpServer())
        .post('/notes')
        .send(notesDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })
    
    it('POST /notes => should should return 400 when receive only title', async () => {

        const newUser = await createUser(prisma);
        const token = await generateValidToken(jwt, prisma, newUser);
    
        const onlyTitle = {
            title: faker.lorem.sentence()
        }

        await createNotes(prisma, newUser.id)

        await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(onlyTitle)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('GET /notes => should return all user notes', async () => {


        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        
        await createNotes(prisma, newUser.id)
        await createNotes(prisma, newUser.id)
        

       const {body} = await request(app.getHttpServer())
       .get('/notes')
       .set('Authorization', `Bearer ${token}`)
       .expect(HttpStatus.OK)
       expect(body).toHaveLength(2);
    })

    it('GET /notes/:id => should return a specific user notes', async () => {

        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        const notes = await createNotes(prisma, newUser.id);

        const {body} = await request(app.getHttpServer())
        .get(`/notes/${notes.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        expect(body).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            notes: expect.any(String),
            userId: newUser.id
        })
    })

    it('GET /notes/:id => should return 404 when try to get a not found id', async () => {
        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);

        await request(app.getHttpServer())
        .get('/notes/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND)
    })

    it('DELETE /notes => should delete a specific user notes', async () => {
        const newUser = await createUser(prisma);
        const token =  await generateValidToken(jwt, prisma, newUser);
        const notes = await createNotes(prisma, newUser.id);

        await request(app.getHttpServer())
        .delete(`/notes/${notes.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)

        const result = await prisma.notes.findMany();
        expect(result).toHaveLength(0);
    })

    it('', async () => {

    })
})