import { Module } from '@nestjs/common';
import { FilmResolver } from './films.resolver';
import { CutResolver } from './cuts.resolver';

@Module({
  providers: [FilmResolver, CutResolver],
})
export class FilmsModule {}
