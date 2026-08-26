import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Technology } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class TechnologyService {
  private readonly http = inject(HttpClient);
  private readonly base = '/technologies';

  listAll(): Observable<Technology[]> {
    return this.http.get<Technology[]>(this.base);
  }

  listByCategory(category: string): Observable<Technology[]> {
    return this.http.get<Technology[]>(`${this.base}/category/${category}`);
  }
}
