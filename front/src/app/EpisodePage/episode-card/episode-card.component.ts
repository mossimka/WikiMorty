import {Component, Input} from '@angular/core';
import {Episode} from '../../interfaces/episode';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-episode-card',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './episode-card.component.html',
  styleUrl: './episode-card.component.css'
})
export class EpisodeCardComponent {
    @Input() episode!: Episode;

    constructor() {}
}
