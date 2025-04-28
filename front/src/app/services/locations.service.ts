import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocationI, LocationsApiResponse} from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private locationsApiUrl = `${environment.apiUrl}/locations`;
  constructor(private http: HttpClient) { }

  getLocations(page: number = 1): Observable<LocationsApiResponse> {
    let queryParams = new HttpParams();
    if (page > 0) {
        queryParams = queryParams.set('page', page.toString());
    }
    return this.http.get<LocationsApiResponse>(this.locationsApiUrl, { params: queryParams });
  }

  getLocationById(id: number): Observable<LocationI> {
    const endpoint = `${this.locationsApiUrl}/${id}`;
    return this.http.get<LocationI>(endpoint);
  }
}
