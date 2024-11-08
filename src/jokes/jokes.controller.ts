import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { CreateJokeDto } from './dto/create-joke.dto';
import { JokeWithType } from './jokes.model';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('jokes')
export class JokesController {

  constructor(private readonly jokesService: JokesService) { }

  @Get('allDeliverJokes')
  getJokes(@Query('typeId') typeId?: number): JokeWithType[] {
    return this.jokesService.getJokes(typeId);
  }

  @Get('random')
  getRandomJoke(@Query('typeId') typeId?: number): JokeWithType {
    return this.jokesService.getRandomJoke(typeId);
  }

  @Get('types')
  getJokeTypes() {
    return this.jokesService.getJokeTypes();
  }


  @Post('newJoke')
  @UseGuards(JwtAuthGuard) // Add the JwtAuthGuard here
  addNewJoke(@Body() createJokeDto: CreateJokeDto) {
    try {
      return this.jokesService.addNewJoke(createJokeDto);
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
}
