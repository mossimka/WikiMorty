export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharactersApiResponse {
  info: Info;
  results: Character[];
}

export interface CharacterFilters {
    page?: number;
    name?: string;
    status?: string;
    species?: string;
    type?: string;
    gender?: string;
}


export interface CharacterDescriptionResponse {
  character_id: number;
  name: string;
  description: string;
  tags: string[];
}
