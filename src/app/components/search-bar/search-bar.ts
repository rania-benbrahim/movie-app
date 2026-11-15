import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-search-bar',
  imports: [FontAwesomeModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  faMagnifyingGlass = faMagnifyingGlass;
  movieService = inject(MovieService);
  router = inject(Router);

  getMovieByTitle(title: string) {
    this.movieService.searchMovies(title);

    // Si on cherche depuis une autre page, on revient à la liste
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
}
