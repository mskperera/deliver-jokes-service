
export interface Joke {
    id: number;
    typeId: number;
    content: string;
  }
  

  export interface JokeType {
    id: number;
    name: string;
  }

  export interface JokeWithType extends Joke {
    typeName: string;
  }