import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://3.87.70.232:3000';

  constructor(private http: HttpClient) { }

  getVendas(){
    return this.http.get(`${this.apiUrl}/sales/history`)
  }

  getEmails(){
    return this.http.get(`${this.apiUrl}/email`)
  }

  postForm(respostas:any){
    return this.http.post(`${this.apiUrl}/questionario`, respostas)
  }

}
