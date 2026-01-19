import { TestBed } from '@angular/core/testing';

import { SectionTypeService } from './section-type-service';

describe('SectionTypeService', () => {
  let service: SectionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
