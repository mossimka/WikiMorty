import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-photo-viewer',
  imports: [],
  templateUrl: './photo-viewer.component.html',
  styleUrl: './photo-viewer.component.css'
})
export class PhotoViewerComponent {
  @Input() photo: string = '';
  @Output() close  = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
