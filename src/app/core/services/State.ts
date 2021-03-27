import { MessageListConfig } from '../models';

export interface State {
  currentTag?: string;
  currentMessage?: string;
  currentFilters?: MessageListConfig;
}
