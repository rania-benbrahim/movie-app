import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-wish-list',
  imports: [],
  templateUrl: './wish-list.html',
  styleUrl: '../movie-list/movie-list.css',
})
export class WishList {
  movieService = inject(MovieService);
  router = inject(Router);

  navigateTo(movie: Movie) {
    this.router.navigate(['/', movie.id]);
  }
}