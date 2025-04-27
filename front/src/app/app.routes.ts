import { Routes } from '@angular/router';
import {MainComponent} from './main/main.component';
import {CharactersListComponent} from './CharacterPage/characters-list/characters-list.component';
import {EpisodesListComponent} from './EpisodePage/episodes-list/episodes-list.component';
import {LocationsListComponent} from './LocationPage/locations-list/locations-list.component';
import {CharacterDetailsComponent} from './CharacterPage/character-details/character-details.component';

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
      title: 'Details Page'
    },
    {
      path: 'episodes',
      component: EpisodesListComponent,
      title: 'Episodes Page'
    },
    {
      path: 'locations',
      component: LocationsListComponent,
      title: 'Locations Page'
    },
];
