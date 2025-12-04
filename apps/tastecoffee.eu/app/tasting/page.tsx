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
        <Text tag="h1" className="text-[28px] font-bold leading-10 md:text-4xl">
          How to Taste Coffee Like a Pro
        </Text>
        <Text className="mt-4 text-gray-600 max-w-2xl mx-auto">
          A comprehensive guide to developing your palate and appreciating the nuances of specialty coffee
        </Text>
      </div>

      {/* Introduction */}
      <Text className="mt-8 text-sm lg:mt-10 lg:text-base">
        Naming the flavors in a coffee isn't just a way for coffee snobs to show off. When it comes to mastering pour over coffee—or any brew method, really—knowing how to taste coffee and developing a sensory vocabulary is your most important tool. Whether you find a coffee irresistible or off-putting, honing your ability to identify a coffee's distinct qualities will unlock the "why" behind your preferences. Along the way, you may also start to notice when variations in your own brewing technique yield a more beautiful cup.
      </Text>

      {/* What You'll Need Section */}
      <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
        What You'll Need for Coffee Tasting
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        Before diving into the tasting process, gather these essentials:
      </Text>
      <ul className="mt-4 space-y-2 text-sm lg:text-base list-disc list-inside text-gray-700">
        <li><strong>Freshly roasted coffee</strong> – ideally within 2-4 weeks of roast date</li>
        <li><strong>Clean, filtered water</strong> – heated to 90-96°C (195-205°F)</li>
        <li><strong>A consistent brewing method</strong> – pour over, French press, or cupping setup</li>
        <li><strong>Cupping spoons</strong> – or regular soup spoons for slurping</li>
        <li><strong>A notebook</strong> – to record your observations and build your flavor memory</li>
        <li><strong>A flavor wheel</strong> – the SCA Coffee Taster's Flavor Wheel is an excellent reference</li>
      </ul>

      {/* The Five Essentials */}
      <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
        The Five Essentials to Coffee Tasting
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        When baristas learn to make espresso and pour over coffee in our training lab, they simultaneously learn to taste. Coffee professionals everywhere share a common way of breaking down a brewed coffee into observable parts. On our teams, we focus on five taste categories we find most helpful in differentiating one cup of coffee from another: sweetness, body, acidity, flavors, and finish. Understanding the contribution of each gives you the language to describe a Brazilian single origin versus a Rwandan single origin; or to explain why, on an overcast morning, you crave a hefty blend.
      </Text>

      {/* 1. Sweetness */}
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
        1. SWEETNESS
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        Contrary to its bitter reputation, the better the coffee, the sweeter it typically tastes. The presence of sweetness is, in fact, one of the reasons we prefer Coffea arabica to Coffea canephora (aka robusta), its more acerbic cousin.
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        With every coffee you drink, ask yourself what kinds of sweetness you detect, whether fresh fruit, honey, or darker caramel or molasses. When you eat, pay attention to the differences between honey and maple syrup, or white and brown sugar. Store these sensory memories and call upon them when tasting coffees. Once you're comfortable, go a step further and brew two coffees side by side. An East African single origin's sweetness might resemble a light honey, while a Colombian coffee may remind you of butterscotch.
      </Text>
      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <Text className="text-sm font-medium text-amber-800">Common sweetness descriptors:</Text>
        <Text className="text-sm text-amber-700 mt-1">Brown sugar, honey, maple syrup, caramel, molasses, fruit sugars, vanilla, chocolate</Text>
      </div>

      {/* 2. Body */}
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
        2. BODY
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        This is the weight and feel of the coffee on your tongue, one of the easiest qualities for new tasters to grasp. Does the coffee feel light like skim milk or heavy like whipping cream? How does the coffee dose and brew method affect a coffee's body?
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        Body is influenced by several factors: the coffee's origin, processing method, roast level, and brewing technique. Coffees from Sumatra or Brazil often have heavier bodies, while Ethiopian or Kenyan coffees tend toward lighter, more tea-like textures. French press brewing typically produces fuller body than pour over methods.
      </Text>
      <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
        <Text className="text-sm font-medium text-stone-800">Body spectrum:</Text>
        <Text className="text-sm text-stone-700 mt-1">Light (tea-like, watery) → Medium (milk-like, silky) → Full (creamy, syrupy, buttery)</Text>
      </div>

      {/* 3. Acidity */}
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
        3. ACIDITY
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        One of the most prized attributes and one of the most misunderstood, acidity adds brightness and dimension to coffee. While pH might come to mind, that stays relatively stable in coffees across the flavor spectrum and is not what we're measuring here. Instead, we're talking about the quality of each coffee's acidity. Does it have a mild melon-like tang or is its tartness more lemon-like? Is it muted and barely perceptible, as in a dark-roasted chocolaty blend?
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        Roast level affects our perception of a coffee's acidity. The darker the roast, the more we taste the effect of the roast (like more caramelized sugars), and the less we taste the juicy or tart aspects we collectively think of as acidity.
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        High-altitude coffees from regions like Ethiopia, Kenya, and Colombia are known for their vibrant acidity. This brightness is what makes specialty coffee so exciting and complex.
      </Text>
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <Text className="text-sm font-medium text-yellow-800">Types of acidity:</Text>
        <Text className="text-sm text-yellow-700 mt-1">Citric (lemon, orange), Malic (apple, pear), Tartaric (grape), Phosphoric (sparkling), Acetic (wine-like)</Text>
      </div>

      {/* 4. Flavors */}
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
        4. FLAVORS
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        Beginning tasters often believe they can taste only coffee. That's a good place to start. But take another sip. Can you taste toasted almonds or candied walnuts? Fruit notes of blueberry or nectarine? Floral notes of rose or gardenia?
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        Use the fact that you eat food, likely several times a day, as a daily source of raw sensory data. Next time you taste a dried cherry, bank the concentrated stone-fruit flavors in your mind. Call upon the flavors you already know well to see what matches the coffee you're currently drinking.
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        The SCA Coffee Taster's Flavor Wheel categorizes flavors into families: fruity, sour/fermented, green/vegetative, roasted, spices, nutty/cocoa, sweet, and floral. Within each family are increasingly specific descriptors that help pinpoint exactly what you're tasting.
      </Text>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <Text className="text-xs font-medium text-red-800">Fruity</Text>
          <Text className="text-xs text-red-600 mt-1">Berry, citrus, stone fruit, dried fruit</Text>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <Text className="text-xs font-medium text-green-800">Floral/Herbal</Text>
          <Text className="text-xs text-green-600 mt-1">Jasmine, rose, chamomile, tea-like</Text>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <Text className="text-xs font-medium text-orange-800">Nutty/Cocoa</Text>
          <Text className="text-xs text-orange-600 mt-1">Almond, hazelnut, chocolate, cocoa</Text>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <Text className="text-xs font-medium text-purple-800">Spices</Text>
          <Text className="text-xs text-purple-600 mt-1">Cinnamon, clove, pepper, cardamom</Text>
        </div>
      </div>

      {/* 5. Finish */}
      <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
        5. FINISH
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        One of the magical things about a great cup, even five minutes after you sip it, is that you can still experience its flavors. We often describe finish in terms of duration and texture. Is it fleeting or lingering? Is it rough or smooth? What's your last impression of it? Are you sad to see it go?
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        A clean finish indicates a well-processed coffee, while a muddy or ashy finish might suggest defects in processing or roasting. The best coffees leave you with a pleasant, memorable aftertaste that invites you back for another sip.
      </Text>
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <Text className="text-sm font-medium text-slate-800">Finish qualities to note:</Text>
        <Text className="text-sm text-slate-700 mt-1">Duration (short, medium, long), Texture (clean, dry, coating), Character (sweet, bitter, fruity)</Text>
      </div>

      {/* The Tasting Process */}
      <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
        The Professional Tasting Process
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        Coffee professionals use a standardized method called cupping to evaluate coffees. Here's a simplified version you can practice at home:
      </Text>
      <ol className="mt-4 space-y-4 text-sm lg:text-base">
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">1</span>
          <div>
            <Text className="font-medium">Smell the dry grounds</Text>
            <Text className="text-gray-600 text-sm">Note the fragrance before adding water. What aromas do you detect?</Text>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">2</span>
          <div>
            <Text className="font-medium">Add hot water and smell again</Text>
            <Text className="text-gray-600 text-sm">The aroma changes when water releases volatile compounds. Break the crust after 4 minutes and inhale deeply.</Text>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">3</span>
          <div>
            <Text className="font-medium">Slurp with force</Text>
            <Text className="text-gray-600 text-sm">Aerating the coffee spreads it across your entire palate and enhances your perception of flavors.</Text>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">4</span>
          <div>
            <Text className="font-medium">Taste at different temperatures</Text>
            <Text className="text-gray-600 text-sm">Flavors evolve as coffee cools. Taste at hot, warm, and room temperature to get the full picture.</Text>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">5</span>
          <div>
            <Text className="font-medium">Take notes</Text>
            <Text className="text-gray-600 text-sm">Record your impressions for each of the five essentials. Over time, you'll build a valuable reference library.</Text>
          </div>
        </li>
      </ol>

      {/* Regional Flavor Profiles */}
      <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
        Regional Flavor Profiles
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        While every coffee is unique, certain regions are known for characteristic flavor profiles:
      </Text>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <Text className="font-bold text-green-900">Ethiopia</Text>
          <Text className="text-sm text-green-800 mt-2">The birthplace of coffee. Expect floral aromatics, bright berry notes (especially blueberry in natural process), tea-like body, and wine-like complexity.</Text>
        </div>
        <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
          <Text className="font-bold text-amber-900">Colombia</Text>
          <Text className="text-sm text-amber-800 mt-2">Well-balanced with medium body. Notes of caramel, nuts, and red fruits. Clean, sweet finish with mild acidity.</Text>
        </div>
        <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
          <Text className="font-bold text-orange-900">Kenya</Text>
          <Text className="text-sm text-orange-800 mt-2">Bold and complex. Famous for bright, wine-like acidity with blackcurrant and tomato notes. Full body with a long finish.</Text>
        </div>
        <div className="p-5 bg-gradient-to-br from-stone-50 to-zinc-50 rounded-xl border border-stone-200">
          <Text className="font-bold text-stone-900">Brazil</Text>
          <Text className="text-sm text-stone-800 mt-2">Low acidity with heavy body. Nutty, chocolaty, and sweet. Excellent as espresso base or for those who prefer milder coffees.</Text>
        </div>
        <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
          <Text className="font-bold text-teal-900">Guatemala</Text>
          <Text className="text-sm text-teal-800 mt-2">Full-bodied with rich chocolate notes. Subtle spice and floral hints. Bright but balanced acidity with a sweet, lingering finish.</Text>
        </div>
        <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
          <Text className="font-bold text-indigo-900">Indonesia (Sumatra)</Text>
          <Text className="text-sm text-indigo-800 mt-2">Earthy and herbal. Heavy, syrupy body with low acidity. Notes of dark chocolate, tobacco, and tropical fruit.</Text>
        </div>
      </div>

      {/* Common Tasting Mistakes */}
      <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
        Common Tasting Mistakes to Avoid
      </Text>
      <div className="mt-4 space-y-3">
        <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <span className="text-red-500 text-xl">✗</span>
          <div>
            <Text className="font-medium text-red-900">Tasting while your palate is compromised</Text>
            <Text className="text-sm text-red-700">Avoid tasting after eating strong foods, brushing teeth, or drinking alcohol. Your palate needs to be neutral.</Text>
          </div>
        </div>
        <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <span className="text-red-500 text-xl">✗</span>
          <div>
            <Text className="font-medium text-red-900">Only tasting at one temperature</Text>
            <Text className="text-sm text-red-700">Coffee reveals different characteristics as it cools. Always taste throughout the cooling process.</Text>
          </div>
        </div>
        <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <span className="text-red-500 text-xl">✗</span>
          <div>
            <Text className="font-medium text-red-900">Being influenced by others before forming your own opinion</Text>
            <Text className="text-sm text-red-700">Taste first, discuss later. Your initial impressions are valuable, even if they differ from experts.</Text>
          </div>
        </div>
        <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <span className="text-red-500 text-xl">✗</span>
          <div>
            <Text className="font-medium text-red-900">Using stale or improperly stored coffee</Text>
            <Text className="text-sm text-red-700">Coffee degrades quickly. Use freshly roasted beans stored in an airtight container away from light and heat.</Text>
          </div>
        </div>
      </div>

      {/* Practice Makes Better */}
      <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
        Practice Makes Better
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        If this seems hard, don't worry. Your morning cup gives you a daily excuse to build your taste vocabulary. When you're up for it, brew a few different coffees for comparison. Or share a cup and trade observations with a friend. These five categories exist to guide your impressions into words. Fortunately, there's never a wrong answer.
      </Text>
      <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
        Here are some exercises to accelerate your learning:
      </Text>
      <ul className="mt-4 space-y-2 text-sm lg:text-base list-disc list-inside text-gray-700">
        <li><strong>Comparative tasting:</strong> Brew two different origins side by side and note the differences</li>
        <li><strong>Blind tasting:</strong> Have someone prepare coffee without telling you the origin—can you identify the region?</li>
        <li><strong>Flavor hunting:</strong> Pick one flavor note (like "citrus") and try to find it in your next five coffees</li>
        <li><strong>Temperature tracking:</strong> Taste the same coffee at 5-minute intervals and note how flavors evolve</li>
        <li><strong>Processing comparison:</strong> Try the same origin with different processing methods (washed vs. natural)</li>
      </ul>

      {/* Call to Action */}
      <div className="mt-12 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200 text-center">
        <Text tag="h3" className="text-xl font-bold text-amber-900">Ready to Put Your Skills to the Test?</Text>
        <Text className="mt-3 text-amber-800">
          Explore specialty coffee shops in your area and practice your tasting skills with a variety of single origins and blends. Every cup is an opportunity to learn.
        </Text>
        <a href="/places" className="inline-block mt-6 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-colors">
          Find Coffee Shops Near You
        </a>
      </div>

    </div>
  </main>
</>
)

export default TastingPage;
