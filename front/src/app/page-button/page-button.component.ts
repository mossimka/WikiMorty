import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-page-button',
  imports: [
    RouterLink
  ],
  templateUrl: './page-button.component.html',
  styleUrl: './page-button.component.css'
})
export class PageButtonComponent {
  @Input({ required: true }) routePath!: string | any[];

  @Input() title: string | null = null;

}
