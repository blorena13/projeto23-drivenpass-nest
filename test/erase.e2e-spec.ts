import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

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

        

    })
})