import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DiceService } from '../../../services/dice.service';

@Component({
  selector: 'app-generala',
  standalone: false,
  templateUrl: './generala.component.html',
  styleUrl: './generala.component.css',
})
export class GeneralaComponent implements OnInit {
  public usuarioLogueado: any = null;
  public resultados: number[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private diceService: DiceService
  ) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log(`${usuario.email} ingreso al la generala`);
      }
      this.usuarioLogueado = usuario;
    });

    window.scrollTo(0, 0);
  }

  lanzarDados() {
    this.diceService.rollDice(5).subscribe(
      (data) => {
        this.resultados = data.result.random.data;
        console.log('Resultados:', this.resultados);
      },
      (error) => {
        console.error('Error al lanzar dados:', error);
      }
    );
  }
}
