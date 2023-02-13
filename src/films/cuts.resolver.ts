import {
  Args,
  Int,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Cut } from './models/cut.model';
import { Film } from './models/film.model';
import ghibliData from './data/ghibli';

@Resolver(Cut)
export class CutResolver {
  @Query(() => [Cut])
  cuts(@Args('filmId', { type: () => Int }) filmId: Film['id']): Cut[] {
    return ghibliData.cuts.filter((x) => x.filmId === filmId);
  }

  @Query(() => Cut, { nullable: true })
  cut(@Args('cutId', { type: () => Int }) cutId: number): Cut | undefined {
    return ghibliData.cuts.find((x) => x.id === cutId);
  }

  @ResolveField(() => Film, { nullable: true })
  film(@Root() cut: Cut): Film | undefined {
    return ghibliData.films.find((film) => film.id === cut.filmId);
  }
}
