import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CastMember, Genre, Movie, Video } from '../interfaces/movie';
import { MovieResponse } from '../interfaces/movie-response';

export interface Category {
  key: string;
  fr: string;
  en: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private readonly http = inject(HttpClient);
  private readonly url = environment.url_api;
  private readonly key = environment.api_key;
  private readonly apiRoot = 'https://api.themoviedb.org/3/';
  readonly imageUrl = 'https://image.tmdb.org/t/p/';

  categories: Category[] = [
    { key: 'now_playing', fr: "À l'affiche", en: 'Now playing' },
    { key: 'popular', fr: 'Populaires', en: 'Popular' },
    { key: 'top_rated', fr: 'Les mieux notés', en: 'Top rated' },
    { key: 'upcoming', fr: 'Prochainement', en: 'Upcoming' }
  ];

  sortOptions: Category[] = [
    { key: 'popularity', fr: 'Popularité', en: 'Popularity' },
    { key: 'vote', fr: 'Meilleure note', en: 'Best rating' },
    { key: 'date', fr: 'Plus récents', en: 'Newest' },
    { key: 'title', fr: 'Titre (A-Z)', en: 'Title (A-Z)' }
  ];

  // ---------- État de l'application (signals) ----------
  movieList = signal<Movie[]>([]);
  selectedMovie = signal<Movie | null>(null);
  wishList = signal<Movie[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  category = signal<string>('now_playing');
  language = signal<string>(localStorage.getItem('language') || 'fr-FR');
  genres = signal<Genre[]>([]);
  selectedGenre = signal<number | null>(null);
  sortBy = signal<string>('popularity');
  loading = signal<boolean>(false);

  // Liste affichée = films filtrés par genre puis triés
  displayedMovies = computed(() => {
    const genre = this.selectedGenre();
    const movies = this.movieList().filter(m => genre === null || m.genre_ids.includes(genre));

    switch (this.sortBy()) {
      case 'vote':
        return movies.sort((a, b) => b.vote_average - a.vote_average);
      case 'date':
        return movies.sort((a, b) => b.release_date.localeCompare(a.release_date));
      case 'title':
        return movies.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return movies.sort((a, b) => b.popularity - a.popularity);
    }
  });

  toWatch = computed(() => this.wishList().filter(m => !m.seen));
  seenMovies = computed(() => this.wishList().filter(m => m.seen));

  // ---------- Traduction de l'interface ----------
  t(fr: string, en: string): string {
    return this.language() === 'fr-FR' ? fr : en;
  }

  label(key: string): string {
    const item = [...this.categories, ...this.sortOptions].find(c => c.key === key);
    if (!item) {
      return '';
    }
    return this.t(item.fr, item.en);
  }

  private params(): string {
    return `api_key=${this.key}&language=${this.language()}`;
  }

  // ---------- Appels à l'API TMDB ----------
  getMovieList(): Observable<Movie[]> {
    return this.http.get<MovieResponse>(`${this.url}${this.category()}?${this.params()}`).pipe(
      map(response => response.results.filter(movie => movie.poster_path))
    );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.url}${id}?${this.params()}`);
  }

  getCast(id: number): Observable<CastMember[]> {
    return this.http.get<{ cast: CastMember[] }>(`${this.url}${id}/credits?${this.params()}`).pipe(
      map(response => response.cast.slice(0, 8))
    );
  }

  getTrailer(id: number): Observable<Video | undefined> {
    return this.http.get<{ results: Video[] }>(
      `${this.url}${id}/videos?${this.params()}&include_video_language=fr,en`
    ).pipe(
      map(response => {
        const youtube = response.results.filter(v => v.site === 'YouTube');
        return youtube.find(v => v.type === 'Trailer') || youtube[0];
      })
    );
  }

  getSimilar(id: number): Observable<Movie[]> {
    return this.http.get<MovieResponse>(`${this.url}${id}/similar?${this.params()}`).pipe(
      map(response => response.results.filter(movie => movie.poster_path).slice(0, 6))
    );
  }

  loadGenres() {
    this.http.get<{ genres: Genre[] }>(`${this.apiRoot}genre/movie/list?${this.params()}`)
      .subscribe(response => this.genres.set(response.genres));
  }

  loadMovies() {
    this.loading.set(true);
    this.getMovieList().subscribe(movies => {
      this.movieList.set(movies);
      this.loading.set(false);
    });
  }

  searchMovies(title: string) {
    this.loading.set(true);
    this.getMovieList().subscribe(movies => {
      this.movieList.set(
        movies.filter(m => m.title.toLowerCase().includes(title.toLowerCase().trim()))
      );
      this.loading.set(false);
    });
  }

  changeCategory(key: string) {
    this.category.set(key);
    this.selectedGenre.set(null);
    this.loadMovies();
  }

  changeLanguage(language: string) {
    this.language.set(language);
    localStorage.setItem('language', language);
    this.loadMovies();
    this.loadGenres();

    const movie = this.selectedMovie();
    if (movie) {
      this.getMovieById(movie.id).subscribe(m => this.selectedMovie.set(m));
    }
  }

  // ---------- Badges et dates ----------
  daysUntil(date: string): number {
    const diff = new Date(date).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  isUpcoming(movie: Movie): boolean {
    return this.daysUntil(movie.release_date) > 0;
  }

  isNew(movie: Movie): boolean {
    const days = this.daysUntil(movie.release_date);
    return days <= 0 && days > -14;
  }

  isFavorite(movie: Movie): boolean {
    return movie.vote_average >= 7.5 && movie.vote_count >= 50;
  }

  // Note TMDB sur 10 -> note sur 5 étoiles (avec demi-étoiles)
  toStars(vote: number): number {
    return Math.round(vote) / 2;
  }

  // ---------- Watchlist ----------
  isInWishlist(id: number): boolean {
    return this.wishList().some(m => m.id === id);
  }

  addToWishlist(movie: Movie) {
    if (!this.isInWishlist(movie.id)) {
      this.wishList.update(list => [...list, { ...movie, seen: false, myRating: 0 }]);
      this.saveWishlist();
    }
  }

  toggleWishlist(movie: Movie) {
    if (this.isInWishlist(movie.id)) {
      this.removeFromWishlist(movie.id);
    } else {
      this.addToWishlist(movie);
    }
  }

  removeFromWishlist(id: number) {
    this.wishList.update(list => list.filter(m => m.id !== id));
    this.saveWishlist();
  }

  toggleSeen(id: number) {
    this.wishList.update(list => list.map(m => m.id === id ? { ...m, seen: !m.seen } : m));
    this.saveWishlist();
  }

  rateMovie(id: number, rating: number) {
    this.wishList.update(list => list.map(m => m.id === id ? { ...m, myRating: rating } : m));
    this.saveWishlist();
  }

  private saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishList()));
  }
}
