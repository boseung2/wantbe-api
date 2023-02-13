import { Module } from '@nestjs/common';
import { FilmResolver } from './resolver/films.resolver';
import { CutResolver } from './resolver/cuts.resolver';

@Module({
  providers: [FilmResolver, CutResolver],
})
export class FilmsModule {}
