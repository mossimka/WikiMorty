import { Component, OnInit } from '@angular/core'; // Import OnInit
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { EpisodesApiResponse, Episode } from '../../interfaces/episode'; // Correct interfaces
import { EpisodesService } from '../../services/episodes.service';     // Correct service
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import {PageButtonComponent} from '../../page-button/page-button.component'; // Correct card component

@Component({
  selector: 'app-episodes-list',
  standalone: true, // <-- Add standalone: true
  imports: [
    CommonModule,
    EpisodeCardComponent,
    PageButtonComponent
  ],
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.css']
})
// Add 'implements OnInit'
export class EpisodesListComponent implements OnInit {
  episodeResponse$!: Observable<EpisodesApiResponse>;
  currentPage = 1;
  totalPages = 1;
  constructor(private episodesService: EpisodesService) {}

  ngOnInit(): void {
    this.loadEpisodes();
  }

  loadEpisodes(): void {
    this.episodeResponse$ = this.episodesService.getEpisodes(this.currentPage);
    this.episodeResponse$.subscribe(response => {
      if (response?.info?.pages) {
         this.totalPages = response.info.pages;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadEpisodes();
    }
  }

  getPageNumberFromUrl(url: string | null): number | null {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      const page = parsedUrl.searchParams.get('page');
      return page ? parseInt(page, 10) : null;
    } catch (e) {
      console.error("Error parsing URL:", e);
      return null;
    }
  }
}
