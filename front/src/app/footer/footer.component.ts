import { Component } from '@angular/core';
import {images} from '../../../public/images/images';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  protected readonly images = images;
}
