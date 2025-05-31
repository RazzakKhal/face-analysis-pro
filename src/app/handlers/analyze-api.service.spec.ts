import { TestBed } from '@angular/core/testing';

import { AnalyzeApiService } from './analyze-api.service';

describe('AnalyzeApiService', () => {
  let service: AnalyzeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyzeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
