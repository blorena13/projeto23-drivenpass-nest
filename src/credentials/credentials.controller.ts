import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserOn } from '../decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateCredentialDto, @UserOn() userOn: User) {
    return this.credentialsService.create(body, userOn.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll( @UserOn() userOn: User) {
    return this.credentialsService.findAll(userOn.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @UserOn() userOn: User) {
    return this.credentialsService.findOne(+id, userOn.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @UserOn() userOn: User) {
    return this.credentialsService.remove(+id, userOn.id);
  }
}
