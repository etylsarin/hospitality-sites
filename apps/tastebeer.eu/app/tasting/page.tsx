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
            How to Taste Beer Like a Pro
          </Text>
          <Text className="mt-4 text-gray-600 max-w-2xl mx-auto">
            A comprehensive guide to developing your palate and appreciating the nuances of craft beer
          </Text>
        </div>

        {/* Introduction */}
        <Text className="mt-8 text-sm lg:mt-10 lg:text-base">
          Have you ever wondered what the craft beer trend is all about? In a market worth over $28 billion globally, there seem to be so many excellent craft beers that it can be overwhelming to differentiate between them. What makes an IPA different from a pale ale? Why do stouts taste so different from pilsners? Understanding how to taste beer properly will unlock the "why" behind your preferences and help you discover new favorites along the way.
        </Text>

        {/* What You'll Need Section */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          What You'll Need for Beer Tasting
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Before diving into the tasting process, gather these essentials:
        </Text>
        <ul className="mt-4 space-y-2 text-sm lg:text-base list-disc list-inside text-gray-700">
          <li><strong>Appropriate glassware</strong> – different styles benefit from different glass shapes (tulip, pint, snifter, weizen)</li>
          <li><strong>Fresh beer</strong> – check the packaging date; most beers are best within 3-6 months</li>
          <li><strong>Proper temperature</strong> – lighter beers at 4-7°C, ales at 7-10°C, strong ales and stouts at 10-13°C</li>
          <li><strong>Neutral palate cleansers</strong> – plain crackers, bread, or room-temperature water</li>
          <li><strong>A notebook</strong> – to record your observations and build your flavor memory</li>
          <li><strong>Good lighting</strong> – to properly assess the beer's appearance and color</li>
        </ul>

        {/* The Five Essentials */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          The Five Essentials to Beer Tasting
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Beer isn't all chuggable macro lager anymore. The craft beer movement has brought a previously unheard-of number of new styles and tastes to the everyday beer drinker. When professionals evaluate beer, they focus on five key categories: appearance, aroma, taste, mouthfeel, and overall impression. Understanding each element gives you the language to describe why you love certain beers and helps you discover new ones you'll enjoy.
        </Text>

        {/* 1. Appearance */}
        <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
          1. APPEARANCE
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Pour the beer into a clean glass—any glass will do, but a tulip glass works well for most styles. If there's a lot of carbonation, tilt the glass to control the head size. For low carbonation beers, pour straight into the center to create a proper head of foam.
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Hold your glass up to a light and observe the color. Is it pale straw, golden, amber, copper, brown, or black? Check clarity—is it brilliant and clear, slightly hazy, or completely opaque? Notice the head: its color, size, texture (rocky, creamy, thin), and retention. The lacing left on the glass as you drink tells a story about the beer's quality and protein content.
        </Text>
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <Text className="text-sm font-medium text-amber-800">Color spectrum (SRM scale):</Text>
          <Text className="text-sm text-amber-700 mt-1">Pale straw (2-3) → Gold (4-6) → Amber (10-14) → Copper (14-17) → Brown (17-30) → Black (30+)</Text>
        </div>

        {/* 2. Aroma */}
        <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
          2. AROMA
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Swirl the beer gently and put your nose right into the glass. Take several short sniffs rather than one long inhalation. Warm the glass in your hands to release more volatile compounds if needed. If you're having trouble detecting aromas, cup your palm over the glass, swirl, then remove and smell immediately.
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Beer aromas come from three main sources: malt (bread, biscuit, caramel, chocolate, coffee, roast), hops (floral, citrus, pine, herbal, tropical fruit, spicy), and yeast (fruity esters, spicy phenols, or clean and neutral). Consider the intensity and complexity of what you smell.
        </Text>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Text className="text-sm font-medium text-yellow-800">Common aroma categories:</Text>
          <Text className="text-sm text-yellow-700 mt-1">Malty (bread, toast, caramel), Hoppy (citrus, pine, floral), Yeasty (fruity, spicy), Off-flavors (know these to identify quality issues)</Text>
        </div>

        {/* 3. Taste */}
        <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
          3. TASTE
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Take a moderate sip—enough to coat your entire mouth. Let it hit your lips, gums, teeth, and all areas of your tongue. Different parts of your palate perceive different sensations: sweetness at the tip, bitterness at the back, and sourness along the sides.
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          When you swallow, keep your mouth closed and exhale through your nose. This retronasal olfaction reveals flavors you can't detect while the beer is in your mouth. Note the initial flavors, the middle palate development, and the finish. How does the taste compare to what you smelled? Is it balanced, or does one element dominate?
        </Text>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Text className="text-xs font-medium text-amber-800">Sweet</Text>
            <Text className="text-xs text-amber-600 mt-1">Malty, caramel, honey, toffee</Text>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <Text className="text-xs font-medium text-green-800">Bitter</Text>
            <Text className="text-xs text-green-600 mt-1">Hops, roasted grains, coffee</Text>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-xs font-medium text-red-800">Sour/Tart</Text>
            <Text className="text-xs text-red-600 mt-1">Citrus, wild yeast, bacteria</Text>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <Text className="text-xs font-medium text-stone-800">Umami/Savory</Text>
            <Text className="text-xs text-stone-600 mt-1">Yeast, aged character</Text>
          </div>
        </div>

        {/* 4. Mouthfeel */}
        <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
          4. MOUTHFEEL
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Mouthfeel describes the physical sensations of beer in your mouth beyond taste. This is the weight and texture—does it feel light like water, medium like milk, or full and chewy like cream? Consider the carbonation level: is it flat, gently effervescent, moderately sparkling, or highly carbonated?
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Notice other textural qualities: Is it smooth or astringent? Creamy or sharp? Does alcohol warmth come through? High-alcohol beers often have a warming sensation that spreads from your throat. The best beers have mouthfeel appropriate to their style—a German pilsner should be crisp and refreshing, while a Russian Imperial Stout should feel rich and velvety.
        </Text>
        <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
          <Text className="text-sm font-medium text-stone-800">Body spectrum:</Text>
          <Text className="text-sm text-stone-700 mt-1">Light (watery, thin) → Medium (balanced, satisfying) → Full (rich, chewy, viscous)</Text>
        </div>

        {/* 5. Overall Impression */}
        <Text tag="h3" className="text-xl leading-8 pt-8 md:!text-xl font-semibold">
          5. OVERALL IMPRESSION
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Now step back and consider the complete picture. How well do all the elements work together? Is the beer balanced, or does one aspect overwhelm the others? Does it represent its style well? Most importantly—do you enjoy drinking it? Would you order another?
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Consider drinkability: some technically excellent beers are challenging to finish, while seemingly simple beers can be remarkably satisfying. Think about the finish—how long do the flavors linger? Is the aftertaste pleasant? A great beer invites you back for another sip.
        </Text>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <Text className="text-sm font-medium text-slate-800">Questions to consider:</Text>
          <Text className="text-sm text-slate-700 mt-1">Is it true to style? Are all elements balanced? Would I drink this again? What food would pair well?</Text>
        </div>

        {/* The Tasting Process */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          The Professional Tasting Process
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Beer judges and professionals follow a systematic approach to evaluation. Here's a simplified process you can use at home:
        </Text>
        <ol className="mt-4 space-y-4 text-sm lg:text-base">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">1</span>
            <div>
              <Text className="font-medium">Pour with intention</Text>
              <Text className="text-gray-600 text-sm">Hold the glass at 45° and pour down the side, gradually straightening to create a proper head of foam.</Text>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">2</span>
            <div>
              <Text className="font-medium">Observe the appearance</Text>
              <Text className="text-gray-600 text-sm">Note color, clarity, head retention, and carbonation bubbles. Hold against a light source for best results.</Text>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">3</span>
            <div>
              <Text className="font-medium">Smell before and after swirling</Text>
              <Text className="text-gray-600 text-sm">Take initial impressions, then swirl to release more aromatics and smell again. Note the differences.</Text>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">4</span>
            <div>
              <Text className="font-medium">Taste mindfully</Text>
              <Text className="text-gray-600 text-sm">Take a moderate sip, let it coat your mouth, swallow, and exhale through your nose. Note the progression of flavors.</Text>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">5</span>
            <div>
              <Text className="font-medium">Taste at different temperatures</Text>
              <Text className="text-gray-600 text-sm">Beer changes as it warms. Evaluate multiple times to get the complete picture—flavors often improve as the beer opens up.</Text>
            </div>
          </li>
        </ol>

        {/* Beer Style Profiles */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Classic Beer Style Profiles
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          While every beer is unique, understanding classic styles helps you know what to expect and appreciate variations:
        </Text>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
            <Text className="font-bold text-yellow-900">Pilsner / Lager</Text>
            <Text className="text-sm text-yellow-800 mt-2">Crisp, clean, and refreshing. Light body with subtle malt sweetness balanced by noble hop bitterness. Expect floral, spicy hop character and a dry finish.</Text>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <Text className="font-bold text-amber-900">India Pale Ale (IPA)</Text>
            <Text className="text-sm text-amber-800 mt-2">Bold hop character with citrus, pine, tropical, or dank notes. Moderate to high bitterness balanced by malt backbone. American IPAs emphasize hops; English versions are more balanced.</Text>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <Text className="font-bold text-orange-900">Pale Ale</Text>
            <Text className="text-sm text-orange-800 mt-2">More balanced than IPA with noticeable malt character. Hop flavors present but not overwhelming. Moderate bitterness and medium body. Highly drinkable.</Text>
          </div>
          <div className="p-5 bg-gradient-to-br from-stone-100 to-zinc-100 rounded-xl border border-stone-300">
            <Text className="font-bold text-stone-900">Stout</Text>
            <Text className="text-sm text-stone-800 mt-2">Dark and roasty with coffee, chocolate, and caramel notes. Full body with creamy mouthfeel. Ranges from dry Irish stouts to rich Imperial versions.</Text>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl border border-amber-300">
            <Text className="font-bold text-amber-900">Wheat Beer</Text>
            <Text className="text-sm text-amber-800 mt-2">Hazy appearance from wheat proteins. Light, refreshing body with subtle banana and clove notes from yeast. German hefeweizens are classic; Belgian witbiers add coriander and orange peel.</Text>
          </div>
          <div className="p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
            <Text className="font-bold text-red-900">Sour / Wild Ale</Text>
            <Text className="text-sm text-red-800 mt-2">Tart and complex from wild yeast and bacteria. Ranges from gently acidic to intensely sour. Often aged in barrels with fruit additions. An acquired taste that rewards exploration.</Text>
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
              <Text className="font-medium text-red-900">Drinking beer too cold</Text>
              <Text className="text-sm text-red-700">Ice-cold temperatures numb your taste buds and suppress aromas. Let beer warm slightly before serious tasting.</Text>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-red-500 text-xl">✗</span>
            <div>
              <Text className="font-medium text-red-900">Using dirty or improperly rinsed glassware</Text>
              <Text className="text-sm text-red-700">Soap residue, oils, and dust can destroy head retention and alter flavors. Always use "beer clean" glasses.</Text>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-red-500 text-xl">✗</span>
            <div>
              <Text className="font-medium text-red-900">Drinking from the bottle or can</Text>
              <Text className="text-sm text-red-700">You miss the appearance entirely and reduce aroma perception dramatically. Always pour into a glass for proper evaluation.</Text>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-red-500 text-xl">✗</span>
            <div>
              <Text className="font-medium text-red-900">Ignoring freshness</Text>
              <Text className="text-sm text-red-700">Most beers are best fresh. IPAs especially degrade quickly—check packaging dates and buy from stores with good turnover.</Text>
            </div>
          </div>
        </div>

        {/* Off-Flavors to Know */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Off-Flavors Every Taster Should Know
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Learning to identify off-flavors helps you distinguish quality issues from intentional style characteristics:
        </Text>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Text className="font-medium text-gray-900">Skunky / Lightstruck</Text>
            <Text className="text-sm text-gray-700 mt-1">Caused by UV light exposure. Found in green and clear bottles. Smells like cannabis or actual skunk.</Text>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Text className="font-medium text-gray-900">Oxidation</Text>
            <Text className="text-sm text-gray-700 mt-1">Stale, cardboard, or sherry-like flavors from oxygen exposure. Indicates old or improperly stored beer.</Text>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Text className="font-medium text-gray-900">Diacetyl</Text>
            <Text className="text-sm text-gray-700 mt-1">Buttery or butterscotch flavor. A flaw in most styles but acceptable at low levels in some English ales.</Text>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Text className="font-medium text-gray-900">DMS (Dimethyl Sulfide)</Text>
            <Text className="text-sm text-gray-700 mt-1">Cooked corn or vegetable character. Can indicate brewing process issues. Very low levels acceptable in some lagers.</Text>
          </div>
        </div>

        {/* Practice Makes Better */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Practice Makes Better
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          If this seems overwhelming, don't worry. Your visits to breweries and craft beer bars give you endless opportunities to build your taste vocabulary. When you're ready to accelerate your learning, try these exercises:
        </Text>
        <ul className="mt-4 space-y-2 text-sm lg:text-base list-disc list-inside text-gray-700">
          <li><strong>Style comparison:</strong> Order two beers of the same style from different breweries and note the differences</li>
          <li><strong>Blind tasting:</strong> Have a friend pour beers without labels—can you identify the style?</li>
          <li><strong>Hop exploration:</strong> Try single-hop IPAs to learn individual hop characteristics (Citra, Mosaic, Simcoe, etc.)</li>
          <li><strong>Temperature tracking:</strong> Taste the same beer at fridge-cold, cellar-cool, and near room temperature</li>
          <li><strong>Food pairing:</strong> Experiment with beer and food combinations to see how flavors interact</li>
        </ul>

        {/* The Beer Judge Certification Program */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Take It Further
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          If you find yourself passionate about beer evaluation, consider exploring the Beer Judge Certification Program (BJCP). Their style guidelines provide detailed descriptions of over 100 beer styles, and certification gives you the vocabulary and framework that professional beer judges use worldwide. Even if you never judge a competition, the knowledge enriches every beer you drink.
        </Text>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200 text-center">
          <Text tag="h3" className="text-xl font-bold text-amber-900">Ready to Put Your Skills to the Test?</Text>
          <Text className="mt-3 text-amber-800">
            Explore craft breweries and beer bars in your area. Every pint is an opportunity to practice your tasting skills and discover something new.
          </Text>
          <a href="/places" className="inline-block mt-6 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-colors">
            Find Craft Beer Near You
          </a>
        </div>

      </div>
    </main>
  </>
);

export default TastingPage;
