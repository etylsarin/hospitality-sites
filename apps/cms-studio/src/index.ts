import { geolocation } from './schemas/geolocation';
import { person } from './schemas/person';
import { place } from './schemas/place';
import { rating } from './schemas/rating/rating';
import { review } from './schemas/review';

export const schemaTypes = [
  person,
  place,
  rating,
  review,
  geolocation,
];
