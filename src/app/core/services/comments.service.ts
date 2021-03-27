import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Comment } from '../models';
import { map } from 'rxjs/operators';
import { MESSAGE_PATH } from './messages.service';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  constructor(private apiService: ApiService) {}

  add(slug, payload): Observable<Comment> {
    return this.apiService
      .post(`/messages/${slug}/comments`, { comment: { body: payload } })
      .pipe(map((comment: any) => ({ ...comment.comment, id: parseInt(comment.comment.id) })));
  }

  getAll(slug): Observable<Comment[]> {
    return this.apiService.get(MESSAGE_PATH + `/${slug}/comments`).pipe(map((data) => data.comments));
  }

  destroy(commentId, messageSlug) {
    return this.apiService.delete(MESSAGE_PATH + `/${messageSlug}/comments/${commentId}`);
  }
}
