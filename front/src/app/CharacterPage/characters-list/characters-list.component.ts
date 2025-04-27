import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CharactersApiResponse, Character } from '../../interfaces/character';
import { CharactersService} from '../../services/characters.service';
import { CharacterCardComponent } from '../character-card/character-card.component'; // <-- Import the new component

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    CommonModule,
    CharacterCardComponent,
  ],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.css']
})
export class CharactersListComponent implements OnInit {
  charactersResponse$!: Observable<CharactersApiResponse>;
  currentPage = 1;
  totalPages = 1;

  constructor(private charactersService: CharactersService) { }

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.charactersResponse$ = this.charactersService.getCharacters(this.currentPage);
    this.charactersResponse$.subscribe(response => {
      this.totalPages = response.info.pages;
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadCharacters();
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
