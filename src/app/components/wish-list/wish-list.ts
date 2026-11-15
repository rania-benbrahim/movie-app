import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faRotateLeft, faTicket, faXmark } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';
import { Stars } from '../stars/stars';

@Component({
  selector: 'app-wish-list',
  imports: [FontAwesomeModule, Stars],
  templateUrl: './wish-list.html',
  styleUrl: './wish-list.css',
})
export class WishList {
  faEye = faEye;
  faRotateLeft = faRotateLeft;
  faTicket = faTicket;
  faXmark = faXmark;

  movieService = inject(MovieService);
  router = inject(Router);

  tab = signal<'toWatch' | 'seen'>('toWatch');

  movies(): Movie[] {
    return this.tab() === 'toWatch' ? this.movieService.toWatch() : this.movieService.seenMovies();
  }

  navigateTo(movie: Movie) {
    this.router.navigate(['/', movie.id]);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goToPass() {
    this.router.navigate(['pass']);
  }
}
