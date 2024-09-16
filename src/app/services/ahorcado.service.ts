import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AhorcadoService {
  private apiUrlCastellano =
    'https://clientes.api.greenborn.com.ar/public-random-word';
  private apiUrlIngles = 'https://random-word-form.herokuapp.com/random';

  constructor(private http: HttpClient) {}

  // Usamos el operador pipe para transformar los resultados antes de que lleguen al consumidor de la función

  getWordsAnjectives(cantidad: number = 5): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrlIngles}/adjective?count=${cantidad}`)
      .pipe(
        map((palabra) =>
          palabra.map((palabra) => palabra.replace(/[-\s]/g, ''))
        )
      );
  }

  getWordsNouns(cantidad: number = 5): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrlIngles}/noun?count=${cantidad}`)
      .pipe(
        map((palabra) =>
          palabra.map((palabra) => palabra.replace(/[-\s]/g, ''))
        )
      );
  }

  getWordsAnimals(cantidad: number = 5): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrlIngles}/animal?count=${cantidad}`)
      .pipe(
        map((palabra) =>
          palabra.map((palabra) => palabra.replace(/[-\s]/g, ''))
        )
      );
  }

  obtenerPalabras(cantidad: number = 5): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrlCastellano}?c=${cantidad}`)
      .pipe(
        map((palabras) =>
          palabras.map((palabra) => this.eliminarAcentos(palabra))
        )
      );
  }

  private eliminarAcentos(palabra: string): string {
    return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
