import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Comment, UserService } from '../core';
import { State } from '../core/services/state';

@Component({
  selector: 'app-message-comment',
  templateUrl: './message-comment.component.html',
  styleUrls: ['./message-comment.component.scss'],
})
export class MessageCommentComponent implements OnInit {
  @Input() comment: Comment;
  @Output() deleteComment = new EventEmitter<boolean>();
  canModify: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Load the current user's data
    this.userService.state$.subscribe((state: State) => {
      this.canModify = state.user?.username === this.comment.author?.username;
    });
  }

  deleteClicked() {
    this.deleteComment.emit(true);
  }
}
