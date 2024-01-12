import {defineType} from 'sanity';

export default defineType({
  name: 'rating',
  title: 'Rating',
  type: 'number',
  validation: (rule) => rule.min(1).max(5),
});
