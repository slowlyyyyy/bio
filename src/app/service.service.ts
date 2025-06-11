import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getVendas(){
    return this.http.get(`${this.apiUrl}/sales/history`)
  }

  postForm(respostas:any){
    return this.http.post(`${this.apiUrl}/questionario`, respostas)
  }

}
