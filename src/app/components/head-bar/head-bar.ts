import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faTicket } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-head-bar',
  imports: [FontAwesomeModule],
  templateUrl: './head-bar.html',
  styleUrl: './head-bar.css',
})
export class HeadBar {
  faHeart = faHeart;
  faTicket = faTicket;
  router = inject(Router);
  movieService = inject(MovieService);

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToWishList() {
    this.router.navigate(['wishlist']);
  }

  navigateToPass() {
    this.router.navigate(['pass']);
  }
}
