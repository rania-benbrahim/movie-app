import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-movie-list',
  imports: [],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList implements OnInit {

  movieService = inject(MovieService);
  router = inject(Router);

  ngOnInit(): void {
    this.movieService.getMovieList().subscribe(
      response => this.movieService.movieList.set(response)
    );
  }

  navigateTo(movie: Movie) {
    this.router.navigate(['/', movie.id]);
  }
}