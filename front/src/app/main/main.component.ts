import { Component } from '@angular/core';
import {PageButtonComponent} from '../page-button/page-button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [
    PageButtonComponent,
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
