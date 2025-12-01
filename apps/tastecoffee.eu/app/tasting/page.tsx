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
          How to Taste Coffee Like a Pro
        </Text>
      </div>
      <Text className="mt-2 text-sm lg:mt-3">
        Naming the flavors in a coffee isn’t just a way for coffee snobs to show off. When it comes to mastering pour over coffee—or any brew method, really—knowing how to taste coffee and developing a sensory vocabulary is your most important tool. Whether you find a coffee irresistible or off-putting, honing your ability to identify a coffee’s distinct qualities will unlock the “why” behind your preferences. Along the way, you may also start to notice when variations in your own brewing technique yield a more beautiful cup. 
      </Text>
      <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
        The Five Essentials to Coffee Tasting
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        When baristas learn to make espresso and pour over coffee in our training lab, they simultaneously learn to taste. Coffee professionals everywhere share a common way of breaking down a brewed coffee into observable parts. On our teams, we focus on five taste categories we find most helpful in differentiating one cup of coffee from another: sweetness, body, acidity, flavors, and finish. Understanding the contribution of each gives you the language to describe a Brazilian single origin versus a Rwandan single origin; or to explain why, on an overcast morning, you crave a hefty blend. 
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        1. SWEETNESS
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Contrary to its bitter reputation, the better the coffee, the sweeter it typically tastes. The presence of sweetness is, in fact, one of the reasons we prefer Coffea arabica to Coffea canephora (aka robusta), its more acerbic cousin. 
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        With every coffee you drink, ask yourself what kinds of sweetness you detect, whether fresh fruit, honey, or darker caramel or molasses. When you eat, pay attention to the differences between honey and maple syrup, or white and brown sugar. Store these sensory memories and call upon them when tasting coffees. Once you’re comfortable, go a step further and brew two coffees side by side. An East African single origin’s sweetness might resemble a light honey, while a Colombian coffee may remind you of butterscotch.
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        2. BODY
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        This is the weight and feel of the coffee on your tongue, one of the easiest qualities for new tasters to grasp. Does the coffee feel light like skim milk or heavy like whipping cream? How does the coffee dose and brew method affect a coffee’s body?  
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        3. ACIDITY
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        One of the most prized attributes and one of the most misunderstood, acidity adds brightness and dimension to coffee. While pH might come to mind, that stays relatively stable in coffees across the flavor spectrum and is not what we’re measuring here. Instead, we’re talking about the quality of each coffee’s acidity. Does it have a mild melon-like tang or is its tartness more lemon-like? Is it muted and barely perceptible, as in a dark-roasted chocolaty blend?
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Roast level affects our perception of a coffee’s acidity. The darker the roast, the more we taste the effect of the roast (like more caramelized sugars), and the less we taste the juicy or tart aspects we collectively think of as acidity. 
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        4. FLAVORS
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Beginning tasters often believe they can taste only coffee. That’s a good place to start. But take another sip. Can you taste toasted almonds or candied walnuts? Fruit notes of blueberry or nectarine? Floral notes of rose or gardenia? 
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        Use the fact that you eat food, likely several times a day, as a daily source of raw sensory data. Next time you taste a dried cherry, bank the concentrated stone-fruit flavors in your mind. Call upon the flavors you already know well to see what matches the coffee you’re currently drinking. 
      </Text>
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl">
        5. FINISH
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        One of the magical things about a great cup, even five minutes after you sip it, is that you can still experience its flavors. We often describe finish in terms of duration and texture. Is it fleeting or lingering? Is it rough or smooth? What’s your last impression of it? Are you sad to see it go?
      </Text>
      <Text tag="h2" className="text-xl pt-8 md:!text-2xl xl:!text-3xl">
        Practice Makes Better
      </Text>
      <Text className="mt-2 text-sm lg:mt-3">
        If this seems hard, don’t worry. Your morning cup gives you a daily excuse to build your taste vocabulary. When you’re up for it, brew a few different coffees for comparison. Or share a cup and trade observations with a friend. These five categories exist to guide your impressions into words. Fortunately, there’s never a wrong answer. 
      </Text>
    </div>
  </main>
</>
)

export default TastingPage;