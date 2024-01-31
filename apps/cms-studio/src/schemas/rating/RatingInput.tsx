import {Grid, Button} from '@sanity/ui';
import {NumberInputProps, set} from 'sanity';
import {useMemo, useCallback, MouseEvent} from 'react';

/**
 * Function that finds the `min` and `max` rules from validations,
 * and generates the range of numbers between them
 **/
const generateRange = (validation: any[]) => {
    const [min, max] = validation
      .reduce((acc, {_rules}) => {
        return [...acc, ..._rules];
      }, [])
      .filter((rule: any) => ['max', 'min'].includes(rule.flag))
      .map((rule: any) => rule.constraint);
  
    let range = [];
    for (let i = min; i <= max; i++) {
      range.push(i);
    }
  
    return range;
};

export const RatingInput = (props: NumberInputProps) => {
  const {onChange, schemaType, value} = props;
  const {validation = []} = schemaType;

  const range = useMemo(() => generateRange(validation as any[]), [validation]);
	
  const handleScore = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const value = Number(event.currentTarget.value);
      onChange(set(value));
    },
    [onChange]
  );

  return (
    <Grid columns={range.length} gap={1}>
      {range.map((index) => (
        <Button
          key={index}
          mode={value === index ? 'default' : 'ghost'}
          tone={value === index ? 'primary' : 'default'}
          text={index.toString()}
          value={index}
		  onClick={handleScore}
        />
      ))}
    </Grid>
  );
}
