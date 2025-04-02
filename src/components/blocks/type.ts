import type { FC } from 'react';
import type { Block } from '../../schema';

export interface BlockProps<T extends Block> {
  block: T;
}
