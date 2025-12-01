import { FunctionComponent } from 'react';
import { TransparentHeader, Text } from 'ui-kit';
import { appConfig, getSiteTitle } from '../config';

const siteTitle = getSiteTitle();

const TastingPage: FunctionComponent = () => (
<>
<TransparentHeader title={siteTitle} description={appConfig.metadata.description} className="no-background" />
<main className="flex-grow">
    <div className="container-fluid w-full !max-w-[1248px] pt-12 lg:pt-20 2xl:pb-8 3xl:px-0 3xl:pt-24">
      <div className="text-center">
        <Text tag="h1" className="text-[28px] font-bold leading-10">
          How to Taste Beer Like a Pro
        </Text>
      </div>
      <Text className="mt-2 text-sm lg:mt-3">
        Have you ever wondered what the craft beer trend is all about? In a market worth $19.6 billion dollars, there seem to be so many good craft beers that it is hard to differentiate between them all. What is an IPA? A stout? A pale ale?
      </Text>
      <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
        The Five Essentials to Beer Tasting
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Beer isn’t all chuggable macro lager anymore. The craft beer movement has brought a previously unheard of number of new styles and tastes to the everyday beer drinker, and it’s useful to know how to find and appreciate those tastes. That’s not to say you should sit down, swirl, sniff, and slurp every beer like it’s a glass of fine wine, but some beers are worth some extra time.
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        1. The perfect pour
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Pour the beer into a clean glass. Any glass will do, but a tulip glass is best. If there’s a lot of carbonation, tilt the glass to make sure the head of the beer isn’t too large. If there’s low carbonation, pour the beer straight into the center of the glass to agitate the beer enough to give it a head of foam.
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        2. Stick your nose in it
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Swirl the beer around in the glass and put your nose right in there. Inhale several times. Warm it up in your hands to release more aromas if you need to by cupping the part of the cup where the liquid is. If you’re still having trouble, put your palm over the top of the glass and swirl for a few seconds, trapping the aromas in the glass. Then smell.
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        3. Check it out
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Hold your glass up to a light and tilt it a little. Check out the color, whether it’s clear or hazy, and how much of a head stays on the top of the beer. You can expect different looks for different styles, and the only way to know them all is to practice (drink).
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        4. Back to the smells
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Swirl it up again and stick your nose back in it. The beer will be more agitated and warmer after the first three steps. Note the differences from the first smell.
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        5. Taste
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Finally it’s time to take a sip. Take in just enough to coat your mouth. Let it hit your lips, gums, teeth, and all around your tongue. When you swallow that sip, keep your mouth closed and exhale through your nose. Take note of the initial flavors you notice, the intermediate flavors, and the aftertaste.
      </Text>
      <Text tag="h2" className="text-xl pt-8 md:!text-2xl xl:!text-3xl">
        Taste, again
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Take one more sip, this time focusing on the weight of the beer. Compare it to other beers of the same style you’ve had before.
      </Text>
    </div>
  </main>
</>
)

export default TastingPage;