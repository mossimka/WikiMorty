// src/app/components/character-details/character-details.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
// Убираем BehaviorSubject, finalize остается полезным
import { Observable, switchMap, catchError, of, finalize, tap, filter, map } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

import { Character } from '../../interfaces/character';
import { CharactersService } from '../../services/characters.service';
import { Episode } from '../../interfaces/episode';
import { EpisodesService } from '../../services/episodes.service';
import {PageButtonComponent} from '../../page-button/page-button.component';
import {images} from '../../../../public/images/images';
import {FormatEpisodePipe} from '../../format-episode.pipe';
import {PhotoViewerComponent} from '../../photo-viewer/photo-viewer.component';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, PageButtonComponent, FormatEpisodePipe, PhotoViewerComponent],
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private charactersService = inject(CharactersService);
  private episodesService = inject(EpisodesService);

  character$!: Observable<Character | null>;
  episodes$!: Observable<Episode[] | null>;

  description: string | null = null;
  descriptionLoading = false;
  descriptionError: string | null = null;
  private currentCharacterId: number | null = null;

  loadingError = false;

  selectedPhotoUrl: string | null = null;

  ngOnInit(): void {
    const characterId$ = this.route.paramMap.pipe(
        map(params => params.get('id')),
        filter((id): id is string => id !== null),
        map(id => +id)
    );

    this.character$ = characterId$.pipe(
        switchMap(id => {
            console.log(`Workspaceing character with ID: ${id}`);
            this.loadingError = false;
            this.currentCharacterId = id;
            this.description = null;
            this.descriptionError = null;
            this.descriptionLoading = false;
            return this.charactersService.getCharacterById(id).pipe(
                catchError(error => {
                    console.error("Error fetching character:", error);
                    this.loadingError = true;
                    this.currentCharacterId = null;
                    return of(null);
                })
            );
        }),
         catchError(error => {
             console.error("Error in character fetching pipeline:", error);
             this.loadingError = true;
             this.currentCharacterId = null;
             return of(null);
        })
    );

     this.episodes$ = this.character$.pipe(
        filter((character): character is Character => !!character && !!character.episode && character.episode.length > 0),
        map(character => character.episode.map(url => this.getIdFromUrl(url)).filter((id): id is string => id !== null).map(idStr => +idStr)),
        switchMap(episodeIds => episodeIds.length > 0 ? this.episodesService.getMultipleEpisodesById(episodeIds) : of([])),
        catchError(err => {
          console.error("Error fetching episodes for character:", err);
          return of(null);
        })
     );
  }

  /*fetchAiDescription(): void {
    if (this.currentCharacterId === null) {
      this.descriptionError = "Cannot load  description: ID isn't there.";
      console.error(this.descriptionError);
      return;
    }

    console.log(`Button clicked: Fetching description for ID: ${this.currentCharacterId}`);
    this.descriptionLoading = true;
    this.descriptionError = null;
    this.description = null;

    this.charactersService.getCharacterDescription(this.currentCharacterId).pipe(
      finalize(() => {
        this.descriptionLoading = false;
        console.log('Description fetch finished.');
      })
    ).subscribe({
      next: (response) => {
        console.log('AI Description Response:', response);
        this.description = response.description;
      },
      error: (err) => {
        console.error("Error fetching AI description:", err);
        this.descriptionError = "Can't load description from AI.";
        this.description = null;
      }
    });
  }*/

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

  openPhoto(url: string) {
    this.selectedPhotoUrl = url;
  }

  closePhoto() {
    this.selectedPhotoUrl = null;
  }

  protected readonly images = images;
}
