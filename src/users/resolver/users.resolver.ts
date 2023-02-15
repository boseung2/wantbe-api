import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  ObjectType,
  Field,
  Query,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import User from '../entity/user.entity';
import LoginInput from '../input/login.input';
import SignUpInput from '../input/sign-up.input';
import { UsersService } from '../uesrs.service';
import { GqlAuthGuard } from '../../auth/guard/gql-auth.guard';

@ObjectType({ description: '필드 에러 타입' })
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType({ description: '로그인 반환 데이터' })
class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;
}

@Resolver(User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<User> {
    const { email, username, password } = signUpInput;

    return this.usersService.createUser(email, username, password);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const { emailOrUsername, password } = loginInput;

    return this.usersService.login(emailOrUsername, password);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { nullable: true })
  async me(@CurrentUser() userId: number): Promise<User> {
    return this.usersService.getUser(userId);
  }
}
