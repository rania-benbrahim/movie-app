import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCheck, faHeart, faPlay } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
import { CastMember, Movie, Video } from '../../interfaces/movie';
import { Stars } from '../stars/stars';

@Component({
  selector: 'app-movie-detail',
  imports: [DatePipe, FontAwesomeModule, Stars],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail implements OnInit {

  faArrowLeft = faArrowLeft;
  faCheck = faCheck;
  faHeart = faHeart;
  faPlay = faPlay;

  router = inject(Router);
  route = inject(ActivatedRoute);
  movieService = inject(MovieService);

  cast = signal<CastMember[]>([]);
  trailer = signal<Video | undefined>(undefined);
  similar = signal<Movie[]>([]);

  ngOnInit(): void {
    // Se relance à chaque changement d'id (ex : clic sur un film similaire)
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      this.movieService.selectedMovie.set(null);
      this.cast.set([]);
      this.trailer.set(undefined);
      this.similar.set([]);

      this.movieService.getMovieById(id).subscribe(movie => this.movieService.selectedMovie.set(movie));
      this.movieService.getCast(id).subscribe(cast => this.cast.set(cast));
      this.movieService.getTrailer(id).subscribe(video => this.trailer.set(video));
      this.movieService.getSimilar(id).subscribe(movies => this.similar.set(movies));
    });
  }

  backToMovieList() {
    this.router.navigate(['/']);
  }

  addToWish(movie: Movie) {
    this.movieService.addToWishlist(movie);
  }

  openMovie(id: number) {
    this.router.navigate(['/', id]);
  }

  runtime(minutes: number | undefined): string {
    if (!minutes) {
      return '—';
    }
    const hours = Math.floor(minutes / 60);
    const rest = (minutes % 60).toString().padStart(2, '0');
    return `${hours}h${rest}`;
  }

  // Rang et siège "inventés" à partir de l'id du film, pour le billet
  row(id: number): string {
    return String.fromCharCode(65 + (id % 12));
  }

  seat(id: number): number {
    return (id % 30) + 1;
  }

  initials(name: string): string {
    return name.split(' ').map(word => word[0]).slice(0, 2).join('');
  }
}
