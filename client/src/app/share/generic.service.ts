import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  // URL del API, definida en enviroments->enviroment.ts
  urlAPI: string = environment.apiURL;
  //Información usuario actual
  currentUser: any;

  //Inyectar cliente HTTP para las solicitudes al API
  constructor(private http: HttpClient) { }

  // Listar
  list(endopoint: string): Observable<any> {
    return this.http.get<any>(this.urlAPI + endopoint);
  }

  // Obtener
  get(endopoint: string, filtro: any): Observable<any | any[]> {
    return this.http.get<any | any[]>(this.urlAPI + endopoint + `/${filtro}`);
  }

  // Obtener todos
  getAll(endopoint: string): Observable<any | any[]> {
    return this.http.get<any | any[]>(this.urlAPI + endopoint);
  }

  // Crear
  create(endopoint: string, objCreate: any | any): Observable<any | any[]> {
    return this.http.post<any | any[]>(this.urlAPI + endopoint, objCreate);
  }

  // Actualizar
  update(endopoint: string, objUpdate: any | any): Observable<any | any[]> {
    return this.http.put<any | any[]>(
      this.urlAPI + endopoint + `/${objUpdate.id}`,
      objUpdate
    );
  }
}
