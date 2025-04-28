import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
// Removed forkJoin, filter, map, tap - not needed for this simpler version
import {Observable, switchMap, catchError, of, filter, map} from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

import { LocationI } from '../../interfaces/location';
import { LocationsService } from '../../services/locations.service';
import {Character} from '../../interfaces/character';
import {CharactersService} from '../../services/characters.service';

@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private locationsService = inject(LocationsService);
  private charactersService = inject(CharactersService);
  location$!: Observable<LocationI | null>;
  loadingError = false;
  residents$!: Observable<Character[] | null>;

  ngOnInit(): void {
    this.location$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.loadingError = false;
          return this.locationsService.getLocationById(+id).pipe(
            catchError(error => {
              console.error("Error fetching location:", error);
              this.loadingError = true;
              return of(null);
            })
          );
        } else {
          console.error("No location ID found in route parameters.");
          this.loadingError = true;
          return of(null);
        }
      })
    );
    this.residents$ = this.location$.pipe(
      filter((location): location is LocationI => !!location && !!location.residents && location.residents.length > 0),
      map(location =>
        location.residents
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
      const id = urlParts[urlParts.length - 1];
      return id && !isNaN(Number(id)) ? id : null;
    } catch (e) {
      console.error("Could not parse character ID from URL:", characterUrl, e);
      return null;
    }
  }
}
