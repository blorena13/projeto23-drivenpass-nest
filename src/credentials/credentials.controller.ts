import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserOn } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Create a credential."})
  @ApiResponse({status: HttpStatus.CREATED})
  create(@Body() body: CreateCredentialDto, @UserOn() userOn: User) {
    return this.credentialsService.create(body, userOn.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get all user credential."})
  @ApiResponse({status: HttpStatus.OK})
  findAll( @UserOn() userOn: User) {
    return this.credentialsService.findAll(userOn.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get a specific user credential."})
  @ApiResponse({status: HttpStatus.OK})
  findOne(@Param('id') id: string, @UserOn() userOn: User) {
    return this.credentialsService.findOne(+id, userOn.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Delete an user credential."})
  remove(@Param('id') id: string, @UserOn() userOn: User) {
    return this.credentialsService.remove(+id, userOn.id);
  }
}
