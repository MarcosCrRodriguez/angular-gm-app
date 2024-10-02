import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BanderasService {
  private nombresPaises: { [key: string]: string } = {}; // Almacena los nombres de los países

  constructor(private http: HttpClient) {
    this.cargarNombresPaises(); // Cargar los nombres de los países al inicializar el servicio
  }

  // Mapeo de continentes en inglés a español
  private continentes: { [key: string]: string } = {
    Europe: 'Europa',
    Africa: 'África',
    Americas: 'América',
    Asia: 'Asia',
    Oceania: 'Oceanía',
    Antarctic: 'Antártida',
  };

  // Cargar nombres de países desde el archivo JSON
  private cargarNombresPaises(): void {
    this.http
      .get<{ [key: string]: string }>('assets/paises.json')
      .subscribe((data) => {
        this.nombresPaises = data;
      });
  }

  // Función para obtener países con nombres y continentes en español
  getPaises(): Observable<any[]> {
    return this.http.get<any[]>('https://restcountries.com/v3.1/all').pipe(
      map((paises) =>
        paises.map((pais) => ({
          nombre: this.nombresPaises[pais.name.common] || pais.name.common, // Usar nombre en español
          bandera: pais.flags.png,
          continente: this.continentes[pais.region] || pais.region, // Traducir continente si es posible
          poblacion: pais.population,
        }))
      )
    );
  }
}
