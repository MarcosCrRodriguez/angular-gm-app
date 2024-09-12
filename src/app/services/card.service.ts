import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private baseUrl = 'https://deckofcardsapi.com/api/deck';

  constructor(private http: HttpClient) {}

  // Llama a la API para crear un nuevo mazo de cartas y lo baraja
  crearMazo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/new/shuffle/?deck_count=1`);
  }

  // Solicita dos cartas del mazo utilizando el ID del mazo
  // retorna un objeto con una lista de cartas vacía
  repartirCartas(deckId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${deckId}/draw/?count=2`).pipe(
      catchError((error) => {
        return of({ cards: [], remaining: 0 });
      })
    );
  }
}
