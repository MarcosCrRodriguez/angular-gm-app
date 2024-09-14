import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AhorcadoService {
  private apiUrl = 'https://www.palabrasaleatorias.com/';

  constructor(private http: HttpClient) {}
}
