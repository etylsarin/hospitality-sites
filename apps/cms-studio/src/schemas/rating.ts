import {defineType} from 'sanity';

export const rating = defineType({
  name: 'rating',
  title: 'Rating',
  type: 'number',
  validation: (rule) => rule.min(1).max(5),
});
