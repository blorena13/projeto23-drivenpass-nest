import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialsService } from './credentials/credentials.service';
import { NotesService } from './notes/notes.service';
import { CardService } from './card/card.service';
import { UsersService } from './users/users.service';
import * as bcrypt from "bcrypt";
import { DeleteDto } from './users/dto/delete-user.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly notesService: NotesService,
    private readonly cardService: CardService,
    private readonly userService: UsersService) { }
  
  getHealth(): string {
    return `I'm okay!`;
  }

  async eraseAll(body: DeleteDto, userId: number) {
    const verifyPassword = await this.userService.getUserById(userId);
    const decriptPassword = await bcrypt.compare(verifyPassword.password, body.password)
    if(decriptPassword) throw new UnauthorizedException();

    await this.credentialsService.removeByUserId(userId);
    await this.notesService.removeByUserId(userId);
    await this.cardService.removeByUserId(userId);
    return await this.userService.remove(userId);
  }
}
