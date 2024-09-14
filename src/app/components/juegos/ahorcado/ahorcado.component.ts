import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css',
})
export class AhorcadoComponent implements OnInit {
  constructor(private ahorcadoService: AhorcadoService) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
