import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BanderasService {
  constructor(private http: HttpClient) {}

  // Función para obtener países con datos filtrados
  getPaises(): Observable<any[]> {
    return this.http.get<any[]>('https://restcountries.com/v3.1/all').pipe(
      map((paises) =>
        paises.map((pais) => ({
          nombre: pais.name.common,
          bandera: pais.flags.png,
          continente: pais.region,
          poblacion: pais.population,
        }))
      )
    );
  }
}
