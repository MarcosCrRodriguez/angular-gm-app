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

  obtenerMazoCompleto(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/new/draw/?count=52`).pipe(
      catchError((error) => {
        console.error('Error obteniendo el mazo completo', error);
        return of({ cards: [], remaining: 0 });
      })
    );
  }
}
