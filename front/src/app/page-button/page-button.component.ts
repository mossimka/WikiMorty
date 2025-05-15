import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-page-button',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './page-button.component.html',
  styleUrl: './page-button.component.css'
})
export class PageButtonComponent {
  @Input({ required: true }) routePath!: string | any[];

  @Input() title: string | null = null;

  @Input() ngClass: any;

}
