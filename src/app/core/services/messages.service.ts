import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Message, MessageListConfig } from '../models';
import { map } from 'rxjs/operators';

export const MESSAGE_PATH = '/messages';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  constructor(private apiService: ApiService) {}

  query(config: MessageListConfig): Observable<{ messages: Message[]; messagesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    const params = { offset: '0', limit: '10' };
    if (config.type === 'feed') {
      params['userOnly'] = true;
    }

    Object.keys(config.filters).forEach((key) => {
      params[key] = '' + config.filters[key];
    });

    return this.apiService.get(MESSAGE_PATH, new HttpParams({ fromObject: params })).pipe(
      map((result) => {
        return { messages: result.messages, messagesCount: result.messagesCount || result.messages?.length || 0 };
      })
    );
  }

  get(slug): Observable<Message> {
    return this.apiService.get(MESSAGE_PATH + '/' + slug).pipe(map((data) => data.message));
  }

  destroy(slug: string) {
    return this.apiService.delete(MESSAGE_PATH + '/' + slug);
  }

  save(message: Message): Observable<Message> {
    // If we're updating an existing message
    if (message.slug) {
      return this.apiService.put(MESSAGE_PATH + '/' + message.slug, message.body).pipe(map((data) => data.message));

      // Otherwise, create a new message
    } else {
      return this.apiService.post(MESSAGE_PATH, { message: message }).pipe(map((data) => data.message));
    }
  }

  favorite(slug): Observable<Message> {
    return this.apiService.post(MESSAGE_PATH + '/' + slug + '/favorite');
  }

  unfavorite(slug): Observable<Message> {
    return this.apiService.delete(MESSAGE_PATH + '/' + slug + '/favorite');
  }
}
