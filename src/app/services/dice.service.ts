import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { diceConfig } from '../../../environment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DiceService {
  private apiUrl = 'https://api.random.org/json-rpc/2/invoke';

  constructor(private http: HttpClient) {}

  rollDice(num: number = 5): Observable<any> {
    const body = {
      jsonrpc: '2.0',
      method: 'generateIntegers',
      params: {
        apiKey: diceConfig.apiKey,
        n: num,
        min: 1,
        max: 6,
        replacement: true,
      },
      id: 1,
    };
    return this.http.post(this.apiUrl, body);
  }
}
