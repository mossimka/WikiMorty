import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap, catchError, of } from 'rxjs';
import { CommonModule, DatePipe, Location } from '@angular/common';

import { Episode } from '../../interfaces/episode';
import { EpisodesService } from '../../services/episodes.service';

@Component({
  selector: 'app-episode-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.css']
})
export class EpisodeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private episodesService = inject(EpisodesService);

  episode$!: Observable<Episode | null>;
  loadingError = false;

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

}
