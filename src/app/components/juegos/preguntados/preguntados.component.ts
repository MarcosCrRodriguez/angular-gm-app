import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css',
})
export class PreguntadosComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
