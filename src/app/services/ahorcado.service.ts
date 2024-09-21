import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { wordnikConfig } from '../../../environment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AhorcadoService {
  private apiUrlCastellano =
    'https://clientes.api.greenborn.com.ar/public-random-word';
  private apiUrlIngles = 'https://random-word-form.herokuapp.com/random';
  // private apiUrlWordnik = 'https://api.wordnik.com/v4/words.json';
  // private apiKey = wordnikConfig.apiKey;

  constructor(private http: HttpClient) {}

  // Usamos pipe para transformar los resultados antes de que lleguen al consumidor de la función

  getWordsAdjectives(cantidad: number = 5): Observable<string[]> {
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

  // // Función para obtener adjetivos desde Wordnik
  // getWordsAdjectives(cantidad: number = 5): Observable<string[]> {
  //   return this.http
  //     .get<any>(
  //       `${this.apiUrlWordnik}/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&limit=${cantidad}&api_key=${this.apiKey}`
  //     )
  //     .pipe(
  //       map((response) =>
  //         response.map((word: any) => word.word.replace(/[-\s]/g, ''))
  //       )
  //     );
  // }

  // // Función para obtener sustantivos desde Wordnik
  // getWordsNouns(cantidad: number = 5): Observable<string[]> {
  //   return this.http
  //     .get<any>(
  //       `${this.apiUrlWordnik}/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&limit=${cantidad}&api_key=${this.apiKey}`
  //     )
  //     .pipe(
  //       map((response) =>
  //         response.map((word: any) => word.word.replace(/[-\s]/g, ''))
  //       )
  //     );
  // }

  // // Función para obtener animales (Wordnik no tiene una categoría específica de animales, por lo que usamos sustantivos generales)
  // getWordsAnimals(cantidad: number = 5): Observable<string[]> {
  //   return this.getWordsNouns(cantidad); // Usa el método getWordsNouns como base
  // }
}
