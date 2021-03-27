import { Component, Input } from '@angular/core';

import { Message } from '../../core';

@Component({
  selector: 'app-message-meta',
  templateUrl: './message-meta.component.html',
  styleUrls: ['./message-meta.component.scss'],
})
export class MessageMetaComponent {
  @Input() message: Message;
}
