import { MessageListConfig } from '../models';

export interface State {
  currentTag?: string;
  tags?: string[];
  currentMessage?: string;
  currentFilters?: MessageListConfig;
}
