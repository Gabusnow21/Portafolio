import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Technology, TechnologyRequest } from '../models/portfolio.models';

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

  getById(id: number): Observable<Technology> {
    return this.http.get<Technology>(`${this.base}/${id}`);
  }

  create(request: TechnologyRequest): Observable<Technology> {
    return this.http.post<Technology>(this.base, request);
  }

  update(id: number, request: TechnologyRequest): Observable<Technology> {
    return this.http.put<Technology>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
