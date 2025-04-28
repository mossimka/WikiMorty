import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
// Import necessary RxJS operators
import { Observable, switchMap, catchError, of, filter, map, forkJoin } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common'; // Removed Location

import { Character } from '../../interfaces/character';
import { CharactersService } from '../../services/characters.service';
import { Episode } from '../../interfaces/episode'; // Import Episode interface
import { EpisodesService } from '../../services/episodes.service'; // Import EpisodesService

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private charactersService = inject(CharactersService);
  private episodesService = inject(EpisodesService);

  character$!: Observable<Character | null>;
  episodes$!: Observable<Episode[] | null>;
  loadingError = false;

  ngOnInit(): void {
    this.character$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.loadingError = false;
          return this.charactersService.getCharacterById(+id).pipe(
            catchError(error => {
              console.error("Error fetching character:", error);
              this.loadingError = true;
              return of(null);
            })
          );
        } else {
          console.error("No character ID found in route parameters.");
          this.loadingError = true;
          return of(null);
        }
      })
    );

    this.episodes$ = this.character$.pipe(
      filter((character): character is Character => !!character && !!character.episode && character.episode.length > 0),
      map(character =>
        character.episode
          .map(url => this.getIdFromUrl(url))
          .filter((id): id is string => id !== null)
          .map(idStr => +idStr)
      ),
      switchMap(episodeIds => {
        if (episodeIds.length > 0) {
          return this.episodesService.getMultipleEpisodesById(episodeIds);
        } else {
          return of([]);
        }
      }),
      catchError(err => {
        console.error("Error fetching episodes for character:", err);
        return of(null);
      })
    );
  }

  getIdFromUrl(url: string | undefined | null): string | null {
    if (!url) {
        return null;
    }
    try {
      const urlParts = url.split('/');
      const id = urlParts[urlParts.length - 1];
      return id && !isNaN(Number(id)) ? id : null;
    } catch (e) {
      console.error("Could not parse ID from URL:", url, e);
      return null;
    }
  }
}
