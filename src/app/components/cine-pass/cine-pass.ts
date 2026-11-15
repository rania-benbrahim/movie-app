import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { Stars } from '../stars/stars';

export interface StatLine {
  label: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-cine-pass',
  imports: [Stars],
  templateUrl: './cine-pass.html',
  styleUrl: './cine-pass.css',
})
export class CinePass {
  movieService = inject(MovieService);
  router = inject(Router);

  // Les chiffres clés, recalculés automatiquement quand la watchlist change
  stats = computed(() => {
    const list = this.movieService.wishList();
    const seen = list.filter(m => m.seen);
    const rated = seen.filter(m => m.myRating);

    const averageTmdb = list.length
      ? list.reduce((sum, m) => sum + m.vote_average, 0) / list.length
      : 0;

    const averageMine = rated.length
      ? rated.reduce((sum, m) => sum + (m.myRating || 0), 0) / rated.length
      : 0;

    const minutes = seen.reduce((sum, m) => sum + (m.runtime || 0), 0);

    return {
      total: list.length,
      seen: seen.length,
      toWatch: list.length - seen.length,
      progress: list.length ? Math.round((seen.length / list.length) * 100) : 0,
      averageTmdb: averageTmdb,
      averageMine: averageMine,
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60
    };
  });

  genreStats = computed(() => {
    const names: string[] = [];
    for (const movie of this.movieService.wishList()) {
      for (const genre of movie.genres || []) {
        names.push(genre.name);
      }
    }
    return this.countBy(names).slice(0, 5);
  });

  languageStats = computed(() => {
    const languages = this.movieService.wishList().map(m => m.original_language.toUpperCase());
    return this.countBy(languages).slice(0, 4);
  });

  // Compte combien de fois chaque valeur apparaît, du plus fréquent au moins fréquent
  countBy(values: string[]): StatLine[] {
    const counts: { [key: string]: number } = {};
    for (const value of values) {
      counts[value] = (counts[value] || 0) + 1;
    }

    const lines = Object.keys(counts)
      .map(label => ({ label: label, count: counts[label], percent: 0 }))
      .sort((a, b) => b.count - a.count);

    const max = lines.length ? lines[0].count : 1;
    return lines.map(line => ({ ...line, percent: Math.round((line.count / max) * 100) }));
  }

  goToWishlist() {
    this.router.navigate(['wishlist']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
