import {Component, Input} from '@angular/core';
import {Episode} from '../../interfaces/episode';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

import {FormatEpisodePipe} from '../../format-episode.pipe';

@Component({
  selector: 'app-episode-card',
  imports: [
    NgIf,
    RouterLink,
    FormatEpisodePipe
  ],
  templateUrl: './episode-card.component.html',
  styleUrl: './episode-card.component.css'
})
export class EpisodeCardComponent {
    @Input() episode!: Episode;

    constructor() {}
}
