// import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import {defineField, defineType} from 'sanity';

export const review = defineType({
  name: 'review',
  title: 'Review',
//  icon: ChatBubbleBottomCenterTextIcon as any,
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'rating',
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      author: 'author.name',
      rating: 'rating',
    },
    prepare(selection) {
      return {
        title: selection.author,
        subtitle: `${selection.rating} star(s)`,
      }
    },
  },
});
