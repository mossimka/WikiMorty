import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap, catchError, of } from 'rxjs';
import { CommonModule, DatePipe, Location } from '@angular/common';

import { Character } from '../../interfaces/character';
import { CharactersService } from '../../services/characters.service';

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

  character$!: Observable<Character | null>;
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
          this.loadingError = true;
          return of(null);
        }
      })
    );
  }
}
