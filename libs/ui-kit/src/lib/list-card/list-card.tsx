import Image from 'next/image';
import { FunctionComponent } from "react";

import { Rating } from '../rating/rating';

import styles from './list-card.module.scss';

export interface Review {
  rating: number;
}

export interface ListCardProps {
  name: string;
  image: {
    url: string;
  };
  established?: string;
  reviews: Review[];
}

export const ListCard: FunctionComponent<ListCardProps> = ({ name, image, established, reviews }) => {
  const rating = reviews.reduce((prev, curr) => prev + curr.rating, 0) / reviews.length;
  const reviewCount = `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;

  return (
    <div>
      <div className={styles.image}><Image src={image.url} alt={`${name} brewery`} width={232} height={180} /></div>
      <div>{established ? `Established ${established}` : null}</div>
      <h4 className={styles.name}>{name}</h4>
      <div className={styles.rating}>
        <Rating
          allowHalf
          allowClear
          defaultValue={rating}
          characterClassName="h-[14px] w-[14px] 3xl:h-[18px] 3xl:w-[18px]"
        />
      </div>
      <div>{reviewCount}</div>
    </div>
  )
}