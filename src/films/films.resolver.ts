import { Query, Resolver } from '@nestjs/graphql';
import { Film } from './models/film.model';
import ghibliData from './data/ghibli';

@Resolver(Film)
export class FilmResolver {
  @Query(() => [Film])
  films(): Film[] {
    return ghibliData.films;
  }
}
