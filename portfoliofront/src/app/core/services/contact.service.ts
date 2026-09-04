import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage, PageResponse } from '../models/portfolio.models';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly base = '/contact';

  send(form: ContactForm): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(this.base, form);
  }

  list(page = 0, size = 20): Observable<PageResponse<ContactMessage>> {
    return this.http.get<PageResponse<ContactMessage>>(this.base, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  listUnread(page = 0, size = 20): Observable<PageResponse<ContactMessage>> {
    return this.http.get<PageResponse<ContactMessage>>(`${this.base}/unread`, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getById(id: number): Observable<ContactMessage> {
    return this.http.get<ContactMessage>(`${this.base}/${id}`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/read`, {});
  }

  archive(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/archive`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  countUnread(): Observable<number> {
    return this.http.get<number>(`${this.base}/unread/count`);
  }
}
