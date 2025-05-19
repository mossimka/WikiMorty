import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {Observable, switchMap, catchError, of, filter, map} from 'rxjs';
import { CommonModule, DatePipe, Location } from '@angular/common';

import { Episode } from '../../interfaces/episode';
import { EpisodesService } from '../../services/episodes.service';
import {LocationI} from '../../interfaces/location';
import {Character} from '../../interfaces/character';
import {CharactersService} from '../../services/characters.service';
import {PageButtonComponent} from '../../page-button/page-button.component';
import {images} from '../../../../public/images/images';
import {FormatEpisodePipe} from '../../format-episode.pipe';

@Component({
  selector: 'app-episode-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    PageButtonComponent,
    FormatEpisodePipe
  ],
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.css']
})
export class EpisodeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private episodesService = inject(EpisodesService);
  private charactersService = inject(CharactersService);

  episode$!: Observable<Episode | null>;
  loadingError = false;
  characters$!: Observable<Character[] | null>;

  ngOnInit(): void {
    this.episode$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.loadingError = false;
          return this.episodesService.getEpisodeById(+id).pipe(
            catchError(error => {
              console.error("Error fetching episode:", error);
              this.loadingError = true;
              return of(null);
            })
          );
        } else {
          console.error("No episode ID found in route parameters.");
          this.loadingError = true;
          return of(null);
        }
      })
    );
    this.characters$ = this.episode$.pipe(
      filter((episode): episode is Episode => !!episode && !!episode.characters && episode.characters.length > 0),
      map(location =>
        location.characters
          .map(url => this.getCharacterId(url))
          .filter((id): id is string => id !== null)
          .map(idStr => +idStr)
      ),
      switchMap(residentIds => {
        if (residentIds.length > 0) {
          return this.charactersService.getMultipleCharactersById(residentIds);
        } else {
          return of([]);
        }
      }),
       catchError(err => {
        console.error("Error processing/fetching residents:", err);
        return of(null);
      })
    );
  }

  getCharacterId(characterUrl: string): string | null {
    try {
      const urlParts = characterUrl.split('/');
      return urlParts[urlParts.length - 1];
    } catch (e) {
      console.error("Could not parse character ID from URL:", characterUrl);
      return null;
    }
  }

  protected readonly images = images;
}
