import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Use 127.0.0.1 para evitar problemas de resolução de DNS do localhost

  constructor(private http: HttpClient) { }

  gerarDocumentoWord(dados: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post('https://plano-aulas-backend.onrender.com/IAplan/gerar', dados, {
      responseType: 'blob',
      withCredentials: true // ADICIONADO: Obrigatório para bater com o seu WebConfig do Java
    });
  }
}