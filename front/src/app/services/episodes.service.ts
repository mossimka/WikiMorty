import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, forkJoin, map, Observable, of} from 'rxjs';
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

  getEpisodeById(id: number): Observable<Episode> {
    const endpoint = `${this.episodesApiUrl}/${id}`;
    return this.http.get<Episode>(endpoint);
  }

  getMultipleEpisodesById(ids: number[]): Observable<Episode[]> {
    if (!ids || ids.length === 0) {
      return of([]);
    }

    const episodeObservables = ids.map(id =>
      this.getEpisodeById(id).pipe(
        catchError(error => {
          console.warn(`Could not fetch episode with ID ${id}:`, error);
          return of(null);
        })
      )
    );

    return forkJoin(episodeObservables).pipe(
      map(results => results.filter(episode => episode !== null) as Episode[])
    );
  }
}
