import { Component } from '@angular/core';
import {images} from '../../../public/images/images'
import {PageButtonComponent} from '../page-button/page-button.component';
import {NgClass, NgStyle} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [
    PageButtonComponent,
    NgStyle,
    RouterLink,
    NgClass
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  images = images;

  currentTheme: 'light' | 'dark' = 'light';

  get themeIcon() {
    return this.currentTheme === 'light' ? this.images.light : this.images.dark;
  }

   changeTheme() {
    if (this.currentTheme === 'light') {
      this.currentTheme = 'dark';
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.currentTheme = 'light';
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.currentTheme = savedTheme;
      document.body.classList.add(savedTheme);
    }
  }
}
