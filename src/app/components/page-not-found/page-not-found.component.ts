import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  home() {
    this.router.navigate(['/home']);
  }
}
