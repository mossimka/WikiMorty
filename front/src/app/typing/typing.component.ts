import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [],
  templateUrl: './typing.component.html',
  styleUrl: './typing.component.css'
})
export class TypingComponent {
  @Input() text: string = '';
  typedDescription: string = '';

  ngOnInit() {
    if (this.text) {
      this.animateTyping(this.text);
    }
  }
  animateTyping(text: string) {
    this.typedDescription = '';
    let index = 0;

    const interval = setInterval(() => {
      if(index < text.length) {
        this.typedDescription += text[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);
  }
}
