import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateJokeDto } from './dto/create-joke.dto';
import { CreateJokeTypeDto } from './dto/create-joke-type.dto';
import { JokeWithType } from './jokes.model';

@Injectable()
export class JokesService implements OnModuleDestroy {
  private prisma = new PrismaClient();

  async getJokes(typeId?: number): Promise<JokeWithType[]> {
    const jokes = await this.prisma.joke.findMany({
      where: {
        typeId: typeId
      },
      include: {
        type: true
      }
    });
  
    
    return jokes.map(joke => ({
      ...joke,
      typeName: joke.type.name
    }));
  }
  

  async getRandomJoke(typeId?: number): Promise<JokeWithType> {
    const jokeCount = await this.prisma.joke.count({
      where: {
        typeId: typeId
      }
    });
  
    if (jokeCount === 0) {
      throw new Error('No jokes found for this type');
    }
  
    const randomSkip = Math.floor(Math.random() * jokeCount);
    const joke = await this.prisma.joke.findFirst({
      where: {
        typeId: typeId
      },
      skip: randomSkip,
      take: 1,
      include: {
        type: true
      }
    });
  
    if (!joke) {
      throw new Error('No joke found');
    }
  
    return {
      ...joke,
      typeName: joke.type.name
    };
  }  

  

  async getJokeTypes() {
    return await this.prisma.jokeType.findMany();
  }

  async addNewJoke(createJokeDto: CreateJokeDto) {
    // Check if the joke type exists
    const isValidType = await this.prisma.jokeType.findUnique({
      where: { id: createJokeDto.typeId },
    });
    if (!isValidType) throw new Error('Invalid joke type');

    const existingJoke = await this.prisma.joke.findFirst({
      where: {
        content: createJokeDto.content,
        typeId: createJokeDto.typeId,
      },
    });
    if (existingJoke) throw new Error('Joke with the same content and type already exists');
  
    const newJoke = await this.prisma.joke.create({
      data: {
        content: createJokeDto.content,
        typeId: createJokeDto.typeId,
      },
    });
    return newJoke;
  }
  


async addNewJokeType(createJokeTypeDto: CreateJokeTypeDto) {
 
  const existingType = await this.prisma.jokeType.findFirst({
    where: { name: createJokeTypeDto.name },
  });

  if (existingType) throw new Error('Joke type already exists');

  const newJokeType = await this.prisma.jokeType.create({
    data: {
      name: createJokeTypeDto.name,
    },
  });

  return newJokeType;
}


  // This method will be called when the app shuts down
  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
