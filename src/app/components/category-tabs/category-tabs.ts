import { Component, inject } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { RandomPick } from '../random-pick/random-pick';

@Component({
  selector: 'app-category-tabs',
  imports: [RandomPick],
  templateUrl: './category-tabs.html',
  styleUrl: './category-tabs.css',
})
export class CategoryTabs {
  movieService = inject(MovieService);

  selectGenre(id: number | null) {
    this.movieService.selectedGenre.set(id);
  }

  changeSort(key: string) {
    this.movieService.sortBy.set(key);
  }
}
