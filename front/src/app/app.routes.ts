import { Routes } from '@angular/router';
import {MainComponent} from './main/main.component';
import {CharactersListComponent} from './CharacterPage/characters-list/characters-list.component';
import {EpisodesListComponent} from './EpisodePage/episodes-list/episodes-list.component';
import {LocationsListComponent} from './LocationPage/locations-list/locations-list.component';
import {CharacterDetailsComponent} from './CharacterPage/character-details/character-details.component';
import {EpisodeDetailsComponent} from './EpisodePage/episode-details/episode-details.component';
import {LocationDetailsComponent} from './LocationPage/location-details/location-details.component';

export const routes: Routes = [
  {
        path: '',
        component: MainComponent,
        title: 'Home Page'
    },
    {
      path: 'characters',
      component: CharactersListComponent,
      title: 'Characters Page'
    },
    {
      path: 'characters/:id',
      component: CharacterDetailsComponent,
      title: 'Character Details Page'
    },
    {
      path: 'episodes',
      component: EpisodesListComponent,
      title: 'Episodes Page'
    },
    {
      path: 'episodes/:id',
      component: EpisodeDetailsComponent,
      title: 'Episode Details Page'
    },
    {
      path: 'locations',
      component: LocationsListComponent,
      title: 'Locations Page'
    },
    {
      path: 'locations/:id',
      component: LocationDetailsComponent,
      title: 'Location Details Page'
    },
];
