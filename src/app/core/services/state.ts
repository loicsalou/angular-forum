import { MessageListConfig, User } from '../models';

export interface State {
  user: User;
  currentTag?: string;
  tags?: string[];
  currentMessage?: string;
  currentFilters?: MessageListConfig;
}
