import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { images } from '../../../public/images/images';
import { finalize } from 'rxjs';
import { CharactersService } from '../services/characters.service';
import {NgForOf, NgIf} from '@angular/common';
import { PhotoViewerComponent } from "../photo-viewer/photo-viewer.component";
import { TypingComponent } from "../typing/typing.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink, NgForOf, NgIf, PhotoViewerComponent, TypingComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  protected readonly images = images;
  private charactersService = inject(CharactersService);

  characterImage: string = "";
  description: string | null = null;
  descriptionLoading = false;
  descriptionError: string | null = null;
  tags: string[] = [];

  selectedPhotoUrl: string | null = null;

  generateExampleDescription(): void {
    const examples = [1, 760, 265, 47];
    const randomId = examples[Math.floor(Math.random() * examples.length)];

    this.descriptionLoading = true;
    this.descriptionError = null;
    this.description = null;
    this.tags = [];

    this.charactersService.getCharacterDescription(randomId).pipe(
      finalize(() => {
        this.descriptionLoading = false;
        console.log('Example description fetch complete.');
      })
    ).subscribe({
      next: (response) => {
        console.log('Example AI Description Response:', response);
        this.description = response.description;
        this.tags = response.tags;
      },
      error: (err) => {
        console.error("Error fetching example AI description:", err);
        this.descriptionError = "Can't load example description.";
      }
    });

    this.charactersService.getCharacterImage(randomId).pipe(
      finalize(() => {
        console.log('Example character image fetch complete.');
      })
      ).subscribe({
        next: (response) => {
          console.log('Example Character Image Response:', response);
          this.characterImage = response;
        },
        error: (err) => {
          console.error("Error fetching example character image:", err);
          this.characterImage = "";
        }
      }
    );
  }
  openPhoto(characterImage: string) {
    this.selectedPhotoUrl = characterImage;
  }

  closePhoto() {
    this.selectedPhotoUrl = null;
  }
}

