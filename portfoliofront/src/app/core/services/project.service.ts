import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, PageResponse } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly base = '/projects';

  list(page = 0, size = 9): Observable<PageResponse<Project>> {
    return this.http.get<PageResponse<Project>>(this.base, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  listByType(type: string, page = 0, size = 9): Observable<PageResponse<Project>> {
    return this.http.get<PageResponse<Project>>(`${this.base}/type/${type}`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  listFeatured(page = 0, size = 6): Observable<PageResponse<Project>> {
    return this.http.get<PageResponse<Project>>(`${this.base}/featured`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  search(query: string, page = 0, size = 9): Observable<PageResponse<Project>> {
    return this.http.get<PageResponse<Project>>(`${this.base}/search`, {
      params: new HttpParams().set('q', query).set('page', page).set('size', size)
    });
  }

  getBySlug(slug: string): Observable<Project> {
    return this.http.get<Project>(`${this.base}/slug/${slug}`);
  }

  incrementViews(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/views`, {});
  }
}
