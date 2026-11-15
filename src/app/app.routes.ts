import { Routes } from '@angular/router';
import { MovieList } from './components/movie-list/movie-list';
import { WishList } from './components/wish-list/wish-list';
import { CinePass } from './components/cine-pass/cine-pass';
import { MovieDetail } from './components/movie-detail/movie-detail';

export const routes: Routes = [
  { path: '', component: MovieList },
  { path: 'wishlist', component: WishList },
  { path: 'pass', component: CinePass },
  { path: ':id', component: MovieDetail },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
