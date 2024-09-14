import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent implements OnInit {
  public error!: string;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error =
      navigation?.extras.state?.['error'] || 'Ha ocurrido un error desconocido';
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  home() {
    this.router.navigate(['/home']);
  }
}
