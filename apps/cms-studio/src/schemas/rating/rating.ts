import { defineType } from 'sanity';
import { RatingInput } from './RatingInput';

export const rating = defineType({
  name: 'rating',
  title: 'Rating',
  type: 'number',
  components: {input: RatingInput},
  validation: (rule) => rule.min(1).max(5),
});
