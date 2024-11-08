import { Injectable } from '@nestjs/common';
import { Joke, JokeType, JokeWithType } from './jokes.model';
import { CreateJokeDto } from './dto/create-joke.dto';

@Injectable()
export class JokesService {

  // In-memory database of jokes
  private jokes: Joke[] = [
    { id: 1, typeId: 1, content: 'Why did the chicken cross the road? To get to the other side!' },
    { id: 2, typeId: 2, content: 'Why do programmers prefer dark mode? Because light attracts bugs!' },
    { id: 3, typeId: 1, content: 'I told my wife she was drawing her eyebrows too high. She looked surprised.' },
  ];

  // In-memory database of joke types
  private jokeTypes: JokeType[] = [
    { id: 1, name: 'general' },
    { id: 2, name: 'programming' },
    { id: 3, name: 'dad jokes' },
    { id: 4, name: 'lovejokes' },
  ];

  getJokes(typeId?: number): JokeWithType[] {

    const typeIdNumber = typeId ? Number(typeId) : undefined;
    const filteredJokes = typeIdNumber ? this.jokes.filter(joke => joke.typeId === typeIdNumber) : this.jokes;

    return filteredJokes.map(joke => {
      const type = this.jokeTypes.find(t => t.id === joke.typeId);
      return {
        ...joke,
        typeName: type.name
      };
    });
  }

  getRandomJoke(typeId?: number): JokeWithType {
    const jokes = this.getJokes(typeId);

    // Pick a random joke from the filtered jokes
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    return randomJoke;
  }

  getJokeTypes(): JokeType[] {
    return this.jokeTypes;
  }

  addNewJoke(createJokeDto: CreateJokeDto): Joke {
    const isValidType = this.jokeTypes.some(jokeType => jokeType.id === createJokeDto.typeId);
    if (!isValidType) {
      throw new Error('Invalid joke type');
    }

    const newJoke: Joke = {
      id: this.jokes.length + 1,
      content: createJokeDto.content,
      typeId: createJokeDto.typeId,
    };
    this.jokes.push(newJoke);
    return newJoke;
  }
}
