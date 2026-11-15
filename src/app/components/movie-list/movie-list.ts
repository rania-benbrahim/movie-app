import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';
import { CategoryTabs } from '../category-tabs/category-tabs';
import { Stars } from '../stars/stars';

@Component({
  selector: 'app-movie-list',
  imports: [CategoryTabs, Stars, FontAwesomeModule],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList implements OnInit {

  faHeart = faHeart;
  movieService = inject(MovieService);
  router = inject(Router);

  // 10 cartes grises pendant le chargement
  skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  ngOnInit(): void {
    if (this.movieService.movieList().length === 0) {
      this.movieService.loadMovies();
    }
    if (this.movieService.genres().length === 0) {
      this.movieService.loadGenres();
    }
  }

  navigateTo(movie: Movie) {
    this.router.navigate(['/', movie.id]);
  }

  toggleWish(movie: Movie, event: Event) {
    event.stopPropagation(); // évite d'ouvrir la page détail
    this.movieService.toggleWishlist(movie);
  }
}
