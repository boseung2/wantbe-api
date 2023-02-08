import { Module } from '@nestjs/common';
import { FilmResolver } from './films.resolver';

@Module({
  providers: [FilmResolver],
})
export class FilmsModule {}
