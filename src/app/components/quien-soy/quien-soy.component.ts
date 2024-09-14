import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css',
})
export class QuienSoyComponent implements OnInit {
  email: string = 'rodriguezmarcoscruz@gmail.com';

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
