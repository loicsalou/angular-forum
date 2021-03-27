import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Comment, CommentsService, MessagesService, User, UserService } from '../core';
import { Message } from '../core/models/message.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { State } from '../core/services/state';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-message-page',
  templateUrl: './message.component.html',
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0, height: 0 }), animate(200)]),
      transition(':leave', animate(200, style({ opacity: 0, height: 0 }))),
    ]),
  ],
})
export class MessageComponent implements OnInit, OnDestroy {
  message: Message;
  currentUser: User;
  canModify: boolean;
  comments: Comment[];
  commentControl = new FormControl();
  commentFormErrors;
  isSubmitting = false;
  isDeleting = false;
  private destroyed$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private commentsService: CommentsService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Retreive the prefetched message
    this.route.data.subscribe((data: { message: Message }) => {
      this.message = data.message;

      // Load the comments on this message
      this.populateComments();
    });

    // Load the current user's data
    this.userService.state$.pipe(takeUntil(this.destroyed$)).subscribe((state: State) => {
      this.currentUser = state.user;
      this.canModify = this.currentUser.username === this.message.author.username;
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onToggleFavorite(favorited: boolean) {
    this.message.favorited = favorited;

    if (favorited) {
      this.message.favoritesCount++;
    } else {
      this.message.favoritesCount--;
    }
  }

  onToggleFollowing(following: boolean) {
    this.message.author.following = following;
  }

  deleteMessage() {
    this.isDeleting = true;

    this.messagesService.destroy(this.message.slug).subscribe((success) => {
      this.router.navigateByUrl('/');
    });
  }

  populateComments() {
    this.commentsService.getAll(this.message.slug).subscribe((comments) => (this.comments = comments));
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = {};

    const commentBody = this.commentControl.value;
    this.commentsService.add(this.message.slug, commentBody).subscribe(
      (comment) => {
        this.comments.unshift(comment);
        this.commentControl.reset('');
        this.isSubmitting = false;
      },
      (errors) => {
        this.isSubmitting = false;
        this.commentFormErrors = errors;
      }
    );
  }

  onDeleteComment(comment) {
    this.commentsService.destroy(comment.id, this.message.slug).subscribe((success) => {
      this.comments = this.comments.filter((item) => item !== comment);
    });
  }
}
