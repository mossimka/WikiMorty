import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, forkJoin, map, Observable, of} from 'rxjs';

import {
  Character, CharacterDescriptionResponse,
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

  getMultipleCharactersById(ids: number[]): Observable<Character[]> {
    if (!ids || ids.length === 0) {
      return of([]);
    }
    const characterObservables = ids.map(id =>
      this.getCharacterById(id).pipe(
        catchError(error => {
          console.warn(`Could not fetch character with ID ${id}:`, error);
          return of(null);
        })
      )
    );

    return forkJoin(characterObservables).pipe(
      map(results => results.filter(character => character !== null) as Character[])
    );
  }

  getCharacterDescription(id: number): Observable<CharacterDescriptionResponse> {
    return this.http.get<CharacterDescriptionResponse>(`${this.charactersApiUrl}/${id}/description`);
  }

  getCharacterImage(id: number): Observable<string> {
    return this.http.get<Character>(`${this.charactersApiUrl}/${id}`).pipe(
      map(character => character.image)
    );
  }
}
