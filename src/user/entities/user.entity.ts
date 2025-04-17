import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  username: string;
}
