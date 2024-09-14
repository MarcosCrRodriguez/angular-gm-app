import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AhorcadoService {
  private apiUrl = 'https://www.palabrasaleatorias.com/';
  // https://www.palabrasaleatorias.com/?fs=10&fs2=0&Submit=Nueva+palabra

  constructor(private http: HttpClient) {}
}
