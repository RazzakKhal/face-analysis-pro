import { TestBed } from '@angular/core/testing';

import { ScoreAiApiService } from './score-ai-api.service';

describe('ScoreAiApiService', () => {
  let service: ScoreAiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreAiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
