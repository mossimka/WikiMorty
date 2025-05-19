import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEpisode'
})
export class FormatEpisodePipe implements PipeTransform {
  transform(code: string): string {
    const match = code.match(/^s(\d{2})e(\d{2})$/i);
    if (match) {
      const season = parseInt(match[1], 10);
      const episode = parseInt(match[2], 10);
      return `Season ${season}, Episode ${episode}`;
    }
    return code;
  }
}
