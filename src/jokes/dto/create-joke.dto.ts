import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateJokeDto {
  @IsString()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  typeId: number;
}
