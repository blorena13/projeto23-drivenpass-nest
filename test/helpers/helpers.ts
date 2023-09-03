import { User } from "@prisma/client";
import { JwtService } from '@nestjs/jwt';
import { createUser } from "../factories/users-factory";
import { PrismaService } from "../../src/prisma/prisma.service";

export async function generateValidToken(jwtService: JwtService ,prisma: PrismaService ,user?: User){
const incomingUser = user || (await createUser(prisma));
const token = jwtService.sign({ email: incomingUser.email},{
    subject: String(incomingUser.id),
    issuer: "Driven",
    audience: "user"
});

return token;
}