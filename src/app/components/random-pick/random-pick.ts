import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-random-pick',
  imports: [FontAwesomeModule],
  templateUrl: './random-pick.html',
  styleUrl: './random-pick.css',
})
export class RandomPick {
  faShuffle = faShuffle;
  movieService = inject(MovieService);
  router = inject(Router);

  spinning = signal(false);
  done = signal(false);
  current = signal<Movie | null>(null);

  pick() {
    const movies = this.movieService.displayedMovies();
    if (movies.length === 0 || this.spinning()) {
      return;
    }

    this.spinning.set(true);
    this.done.set(false);
    let turns = 0;

    // Fait défiler des affiches au hasard, comme une roulette
    const timer = setInterval(() => {
      const random = movies[Math.floor(Math.random() * movies.length)];
      this.current.set(random);
      turns++;

      if (turns === 15) {
        clearInterval(timer);
        this.done.set(true);

        // Petite pause pour admirer le résultat, puis on ouvre le film
        setTimeout(() => {
          this.spinning.set(false);
          this.router.navigate(['/', random.id]);
        }, 1400);
      }
    }, 110);
  }
}
