import { TestBed } from '@angular/core/testing';

import { PhotoHandlerService } from './photo-handler.service';

describe('PhotoHandlerService', () => {
  let service: PhotoHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
