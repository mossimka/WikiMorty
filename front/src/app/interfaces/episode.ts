import {Character, Info} from './character';

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}


export interface EpisodesApiResponse {
  info: Info;
  results: Episode[];
}
