import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Director {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;
}
