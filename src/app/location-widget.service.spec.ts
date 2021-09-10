import { TestBed } from '@angular/core/testing';

import { LocationWidgetService } from './location-widget.service';

describe('LocationWidgetService', () => {
  let service: LocationWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
