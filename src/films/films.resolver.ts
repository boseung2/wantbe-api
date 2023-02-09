import {
  Query,
  ResolveField,
  Resolver,
  Root,
  ObjectType,
  Field,
  Int,
  Args,
} from '@nestjs/graphql';
import { Film } from './models/film.model';
import { Director } from './models/director.model';
import ghibliData from './data/ghibli';

@ObjectType()
class PaginatedFilms {
  @Field(() => [Film])
  films: Film[];

  @Field(() => Int, { nullable: true })
  cursor?: Film['id'] | null;
}

@Resolver(Film)
export class FilmResolver {
  @Query(() => PaginatedFilms)
  films(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 6 })
    limit: number,
    @Args('cursor', { type: () => Int, nullable: true, defaultValue: 1 })
    cursor: Film['id'],
  ): PaginatedFilms {
    const realLimit = Math.min(6, limit);

    if (!cursor) return { films: [] };

    const cursorDataIndex = ghibliData.films.findIndex((f) => f.id === cursor);

    if (cursorDataIndex === -1) return { films: [] };

    const result = ghibliData.films.slice(
      cursorDataIndex,
      cursorDataIndex + realLimit,
    );

    const nextCursor = result[result.length - 1].id + 1;
    const hasNext = ghibliData.films.findIndex((f) => f.id === nextCursor) > -1;

    return {
      cursor: hasNext ? nextCursor : null,
      films: result,
    };
  }

  @ResolveField(() => Director)
  director(@Root() parentFilm: Film): Director | undefined {
    return ghibliData.directors.find((dr) => dr.id === parentFilm.director_id);
  }

  @Query(() => Film, { nullable: true })
  film(@Args('filmId', { type: () => Int }) filmId: number): Film | undefined {
    return ghibliData.films.find((x) => x.id === filmId);
  }
}
