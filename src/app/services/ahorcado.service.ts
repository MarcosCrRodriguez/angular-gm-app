import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AhorcadoService {
  private apiUrl = 'https://clientes.api.greenborn.com.ar/public-random-word';

  constructor(private http: HttpClient) {}

  obtenerPalabras(cantidad: number = 10): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrl}?c=${cantidad}`)
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
