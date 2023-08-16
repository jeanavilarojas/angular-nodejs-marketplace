import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    private apiURL = 'https://ubicaciones.paginasweb.cr';

    constructor(private http: HttpClient) { }

    obtenerProvincias(): Observable<any> {
        return this.http.get(`${this.apiURL}/provincias.json`);
    }

    obtenerCantones(province: string): Observable<any> {
        return this.http.get(`${this.apiURL}/provincia/${province}/cantones.json`);
    }

    obtenerDistritos(province: string, canton: string): Observable<any> {
        return this.http.get(`${this.apiURL}/provincia/${province}/canton/${canton}/distritos.json`);
    }
}