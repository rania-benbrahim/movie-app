import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-movie-detail',
  imports: [],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail implements OnInit {

  router = inject(Router);
  route = inject(ActivatedRoute);
  movieService = inject(MovieService);
  added = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => this.movieService.getMovieById(Number(params.get('id'))))
    ).subscribe(movie => this.movieService.selectedMovie.set(movie));
  }

  backToMovieList() {
    this.router.navigate(['/']);
  }

  addToWish(movie: Movie | null) {
    if (movie) {
      this.movieService.addToWishlist(movie);
      this.added = true;
    }
  }
}