import { TestBed } from '@angular/core/testing';

import { BanderasService } from './banderas.service';

describe('BanderasService', () => {
  let service: BanderasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BanderasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
