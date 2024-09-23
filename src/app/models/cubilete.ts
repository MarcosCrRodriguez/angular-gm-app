import { DiceService } from '../services/dice.service';
import { Dado } from './dado';

export class Cubilete {
  public dados: Dado[];

  constructor(cantidad: number = 5) {
    // Inicializamos los dados con un valor arbitrario y no guardados
    this.dados = Array.from({ length: cantidad }, () => ({
      valor: 1,
      guardado: false,
    }));
  }

  // Método para tirar solo los dados no guardados
  tirarDados(diceService: DiceService): Promise<void> {
    return new Promise((resolve, reject) => {
      const dadosNoGuardados = this.dados.filter(
        (dado) => !dado.guardado
      ).length;

      if (dadosNoGuardados > 0) {
        diceService.rollDice(dadosNoGuardados).subscribe(
          (data) => {
            let index = 0;
            // Solo actualizamos los dados que no están guardados
            this.dados.forEach((dado) => {
              if (!dado.guardado) {
                dado.valor = data.result.random.data[index];
                console.log('Resultados:', dado.valor);
                index++;
              }
            });
            resolve();
          },
          (error) => {
            console.error('Error al lanzar dados:', error);
            reject(error);
          }
        );
      } else {
        resolve(); // No hay dados que tirar
      }
    });
  }

  // Método para alternar el estado de guardado de un dado
  toggleGuardarDado(index: number): void {
    if (index >= 0 && index < this.dados.length) {
      this.dados[index].guardado = !this.dados[index].guardado;
    }
  }

  // Método para resetear los dados
  reset(): void {
    this.dados.forEach((dado) => {
      dado.valor = 1;
      dado.guardado = false;
    });
  }

  // Método para obtener los resultados actuales de los dados
  getResultados(): number[] {
    return this.dados.map((dado) => dado.valor);
  }
}
