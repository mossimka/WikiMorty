import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Character,
  CharactersApiResponse
} from '../interfaces/character';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  private charactersApiUrl = `${environment.apiUrl}/characters`;

  constructor(private http: HttpClient) { }

  getCharacters(page: number = 1): Observable<CharactersApiResponse> {
    let queryParams = new HttpParams();
    if (page > 0) {
        queryParams = queryParams.set('page', page.toString());
    }
    return this.http.get<CharactersApiResponse>(this.charactersApiUrl, { params: queryParams });
  }

  getCharacterById(id: number): Observable<Character> {
    const endpoint = `${this.charactersApiUrl}/${id}`;
    return this.http.get<Character>(endpoint);
  }
}
