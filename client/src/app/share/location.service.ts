import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    constructor(private http: HttpClient) { }

    obtenerProvincias(): Observable<any> {
        const url = 'https://ubicaciones.paginasweb.cr/provincias.json';
        return this.http.get<any>(url);
    }

    obtenerCantones(provincia: string): Observable<any> {
        const url = `https://ubicaciones.paginasweb.cr/provincia/${provincia}/cantones.json`;
        return this.http.get<any>(url);
    }

    obtenerDistritos(provincia: string, canton: string): Observable<any> {
        const url = `https://ubicaciones.paginasweb.cr/provincia/${provincia}/canton/${canton}/distritos.json`;
        return this.http.get<any>(url);
    }
}
