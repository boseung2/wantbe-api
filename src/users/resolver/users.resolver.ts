import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import * as argon2 from 'argon2';
import { IsEmail, IsString } from 'class-validator';
import User from '../entity/user.entity';

@InputType()
export class SignUpInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  password: string;
}

@Resolver(User)
export class UsersResolver {
  @Mutation(() => User)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<User> {
    const { email, username, password } = signUpInput;

    const hashedPw = await argon2.hash(password);
    const newUser = User.create({
      email,
      username,
      password: hashedPw,
    });

    await User.insert(newUser);
    return newUser;
  }
}
