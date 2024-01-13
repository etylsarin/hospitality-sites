import { Box, Image, Badge } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { BiSolidStar } from "react-icons/bi";

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
  const property = {
    formattedPrice: '$1,900.00',
  }

  const rating = reviews.reduce((prev, curr) => prev + curr.rating, 0) / reviews.length;

  const reviewCount = `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;

  return (
    <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Image src={image.url} alt={`${name} brewery`} />

      <Box p='6'>
        <Box display='flex' alignItems='baseline'>
          <Badge borderRadius='full' px='2' colorScheme='teal'>
            New
          </Badge>
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            textTransform='uppercase'
            ml='2'
          >
            {established ? `Established ${established}` : null}
          </Box>
        </Box>

        <Box
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
        >
          {name}
        </Box>

        <Box>
          {property.formattedPrice}
          <Box as='span' color='gray.600' fontSize='sm'>
            / wk
          </Box>
        </Box>

        <Box display='flex' mt='2' alignItems='center'>
          {Array(5)
            .fill('')
            .map((_, i) => (
              <BiSolidStar
                key={i}
                color={i < rating ? 'black' : 'silver'}
              />
            ))}
          <Box as='span' ml='2' color='gray.600' fontSize='sm'>
            {reviewCount}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}