import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { LocationsApiResponse } from '../../interfaces/location';
import { LocationsService } from '../../services/locations.service';
import { LocationCardComponent } from '../location-card/location-card.component';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [
    CommonModule,
    LocationCardComponent
  ],
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.css']
})
export class LocationsListComponent implements OnInit {
  locationsResponse$!: Observable<LocationsApiResponse>;
  currentPage = 1;
  totalPages = 1;

  constructor(private locationsService: LocationsService) { }

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.locationsResponse$ = this.locationsService.getLocations(this.currentPage);
    this.locationsResponse$.subscribe(response => {
      if (response?.info?.pages) {
        this.totalPages = response.info.pages;
      } else {
        this.totalPages = 1;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadLocations();
    }
  }
}
