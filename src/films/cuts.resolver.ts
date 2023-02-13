import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Cut } from './models/cut.model';
import { Film } from './models/film.model';
import ghibliData from './data/ghibli';

@Resolver(Cut)
export class CutResolver {
  @Query(() => [Cut])
  cuts(@Args('filmId', { type: () => Int }) filmId: Film['id']): Cut[] {
    return ghibliData.cuts.filter((x) => x.filmId === filmId);
  }
}
