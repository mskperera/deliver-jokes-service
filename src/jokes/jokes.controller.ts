import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { CreateJokeDto } from './dto/create-joke.dto';
import { JokeWithType } from './jokes.model';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateJokeTypeDto } from './dto/create-joke-type.dto';

@Controller('jokes')
export class JokesController {

  constructor(private readonly jokesService: JokesService) { }

  @Get('allDeliverJokes')
  async getJokes(@Query('typeId') typeId?: number): Promise<JokeWithType[]> {
    return await this.jokesService.getJokes(typeId);
  }

  @Get('random')
  async getRandomJoke(@Query('typeId') typeId?: number): Promise<JokeWithType> {
    return await this.jokesService.getRandomJoke(Number(typeId));
  }

  @Get('types')
  async getJokeTypes() {
    return await this.jokesService.getJokeTypes();
  }

  @Post('newJoke')
  @UseGuards(JwtAuthGuard) // Add the JwtAuthGuard here
  async addNewJoke(@Body() createJokeDto: CreateJokeDto) {
    try {
      return await this.jokesService.addNewJoke(createJokeDto);
    } catch (error) {
      if (error.message) {
        throw new HttpException(
          `${error.message}`, HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  @Post('newJokeType')
  @UseGuards(JwtAuthGuard) // Add the JwtAuthGuard here
  async addNewJokeType(@Body() createJokeTypeDto: CreateJokeTypeDto) {
    try {
      return await this.jokesService.addNewJokeType(createJokeTypeDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

}
