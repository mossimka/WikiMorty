import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Episode, EpisodesApiResponse} from '../interfaces/episode';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {
  private episodesApiUrl = `${environment.apiUrl}/episodes`;

  constructor(private http: HttpClient) { }

  getEpisodes(page: number = 1): Observable<EpisodesApiResponse> {
    let queryParams = new HttpParams();
    if (page > 0) {
        queryParams = queryParams.set('page', page.toString());
    }
    return this.http.get<EpisodesApiResponse>(this.episodesApiUrl, { params: queryParams });
  }

  getEpisodesById(id: number): Observable<Episode> {
    const endpoint = `${this.episodesApiUrl}/${id}`;
    return this.http.get<Episode>(endpoint);
  }
}
