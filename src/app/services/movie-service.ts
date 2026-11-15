import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../interfaces/movie';
import { MovieResponse } from '../interfaces/movie-response';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private readonly http = inject(HttpClient);
  private readonly url = environment.url_api;
  private readonly key = environment.api_key;

  movieList = signal<Movie[]>([]);
  selectedMovie = signal<Movie | null>(null);
  wishList = signal<Movie[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'));

  getMovieList(): Observable<Movie[]> {
    return this.http.get<MovieResponse>(`${this.url}now_playing?api_key=${this.key}`).pipe(
      map(response => response.results)
    );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.url}${id}?api_key=${this.key}`);
  }

  addToWishlist(movie: Movie) {
    const alreadyIn = this.wishList().some(m => m.id === movie.id);
    if (!alreadyIn) {
      this.wishList.update(list => [...list, movie]);
      localStorage.setItem('wishlist', JSON.stringify(this.wishList()));
    }
  }
}