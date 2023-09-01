import { Body, Controller, Delete, Get, HttpException, HttpStatus, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { CredentialsService } from './credentials/credentials.service';
import { NotesService } from './notes/notes.service';
import { CardService } from './card/card.service';
import { UsersService } from './users/users.service';
import { UserOn } from './decorators/user.decorator';
import { User } from '@prisma/client';
import { DeleteDto } from './users/dto/delete-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService) {}

  @Get('/health')
  @ApiOperation({summary: "Checks APIs health."})
  @ApiResponse({status: HttpStatus.OK, description: "I'm okay!"})
  getHealth(): string {
    return this.appService.getHealth();
  }

  @Delete('/erase')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Delete a user and clear user data."})
  deleteAll(@Body() body: DeleteDto,  @UserOn() userOn: User){
    try{
      if(!body.password) throw new UnauthorizedException();
      return this.appService.eraseAll(body ,userOn.id);
    } catch(error){
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
