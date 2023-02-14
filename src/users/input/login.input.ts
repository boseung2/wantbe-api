import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType({ description: '로그인 인풋 데이터' })
export default class LoginInput {
  @Field()
  @IsString()
  emailOrUsername: string;

  @Field()
  @IsString()
  password: string;
}
