import { FunctionComponent } from 'react';
import { TransparentHeader, Text } from 'ui-kit';
import { appConfig, getSiteTitle } from '../config';

const siteTitle = getSiteTitle();

const StylesPage: FunctionComponent = () => (
  <>
    <TransparentHeader title={siteTitle} description={appConfig.metadata.description} className="no-background" />
    <main className="flex-grow">
      <div className="container-fluid w-full !max-w-[1248px] pt-12 lg:pt-20 2xl:pb-8 3xl:px-0 3xl:pt-24">
        <div className="text-center">
          <Text tag="h1" className="text-[28px] font-bold leading-10 md:text-4xl">
            Beer Styles Guide
          </Text>
          <Text className="mt-4 text-gray-600 max-w-2xl mx-auto">
            From crisp lagers to bold IPAs—discover the world of beer styles and find your perfect pint
          </Text>
        </div>

        {/* Introduction */}
        <Text className="mt-8 text-sm lg:mt-10 lg:text-base">
          With over 100 recognized beer styles worldwide, the diversity of beer can feel overwhelming. But understanding the major style families makes it easy to navigate any beer menu with confidence. Whether you prefer something light and refreshing or dark and complex, there's a perfect style waiting for you. This guide breaks down the most popular beer styles, their characteristics, and what to expect when you order them.
        </Text>

        {/* Quick Reference */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
          <Text className="font-bold text-amber-900 text-lg">Quick Style Finder</Text>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Text className="text-sm font-medium text-amber-800">Light & Crisp</Text>
              <Text className="text-xs text-amber-700">Pilsner, Lager, Kölsch</Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-amber-800">Hoppy & Bitter</Text>
              <Text className="text-xs text-amber-700">IPA, Pale Ale, NEIPA</Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-amber-800">Dark & Roasty</Text>
              <Text className="text-xs text-amber-700">Stout, Porter, Schwarzbier</Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-amber-800">Sour & Funky</Text>
              <Text className="text-xs text-amber-700">Gose, Berliner, Lambic</Text>
            </div>
          </div>
        </div>

        {/* Lagers Section */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Lagers: Clean, Crisp & Refreshing
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Lagers are fermented at cooler temperatures with bottom-fermenting yeast, resulting in clean, crisp flavors. They're the most popular beer style globally, known for their refreshing drinkability and subtle complexity.
        </Text>
        <div className="mt-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-yellow-900 text-lg">Pilsner</Text>
              <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">4-5.5% ABV</span>
            </div>
            <Text className="text-sm text-yellow-800 mt-2">
              The world's most popular beer style. Czech Pilsners are richer and more hop-forward with Saaz hops, while German Pilsners are drier and crisper. Expect a brilliant golden color, floral/spicy hop aroma, and a clean, bitter finish.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Crisp</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Floral</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Dry Finish</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Helles</Text>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">4.5-5.5% ABV</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              Munich's answer to Pilsner—slightly sweeter and more malt-focused. A soft, bready malt character takes center stage with just enough hop bitterness for balance. The quintessential Bavarian session beer.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Malty</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Balanced</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Soft</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-orange-900 text-lg">Märzen / Oktoberfest</Text>
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full">5.5-6.5% ABV</span>
            </div>
            <Text className="text-sm text-orange-800 mt-2">
              The classic Oktoberfest beer. Amber-colored with rich, toasty malt flavors—think bread crust, light caramel, and a hint of sweetness. Clean lager character with moderate body. Perfect for fall drinking.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Toasty</span>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Amber</span>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Malt-Forward</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border border-amber-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Bock</Text>
              <span className="text-xs px-2 py-1 bg-amber-300 text-amber-900 rounded-full">6-7.5% ABV</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              A strong lager with deep malt complexity. Traditional Bocks are dark amber to brown with rich bread, toffee, and light caramel notes. Doppelbocks are even stronger (7-10% ABV) with dried fruit and chocolate character.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Rich</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Strong</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Warming</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-stone-100 to-stone-50 rounded-xl border border-stone-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-stone-900 text-lg">Dunkel</Text>
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-800 rounded-full">4.5-5.5% ABV</span>
            </div>
            <Text className="text-sm text-stone-700 mt-2">
              Munich's dark lager—smooth, malty, and surprisingly drinkable despite its deep brown color. Expect chocolate, bread, and subtle caramel without the roasted bitterness of stouts. A gentle introduction to dark beers.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Smooth</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Chocolate</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Easy-Drinking</span>
            </div>
          </div>
        </div>

        {/* Ales Section */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Ales: Fruity, Complex & Full-Flavored
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Ales use top-fermenting yeast at warmer temperatures, creating fruitier, more complex flavors. This family includes everything from sessionable pale ales to hop-bomb IPAs.
        </Text>
        <div className="mt-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Pale Ale</Text>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">4.5-6% ABV</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              The gateway to craft beer. English Pale Ales are balanced with earthy, herbal hops, while American Pale Ales (APAs) feature citrus and pine. Medium body, moderate bitterness, and excellent drinkability make this style endlessly appealing.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Balanced</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Citrus</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Accessible</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-orange-900 text-lg">India Pale Ale (IPA)</Text>
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full">5.5-7.5% ABV</span>
            </div>
            <Text className="text-sm text-orange-800 mt-2">
              The flagship of American craft beer. Bold hop character dominates with citrus, pine, tropical fruit, or resinous notes depending on hop selection. Moderate to high bitterness with enough malt backbone for balance. West Coast IPAs are drier and more bitter; East Coast versions are juicier.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Hoppy</span>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Bitter</span>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Bold</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl border border-yellow-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-yellow-900 text-lg">New England IPA (NEIPA)</Text>
              <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">6-8% ABV</span>
            </div>
            <Text className="text-sm text-yellow-800 mt-2">
              A hazy, juice-bomb revolution. Turbid, opaque appearance with intense tropical fruit hop character—mango, passion fruit, guava, citrus. Very low bitterness despite massive hop additions. Soft, pillowy mouthfeel from oats and wheat. Drink fresh!
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Hazy</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Juicy</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Tropical</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-red-900 text-lg">Double / Imperial IPA</Text>
              <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full">7.5-10%+ ABV</span>
            </div>
            <Text className="text-sm text-red-800 mt-2">
              Everything about an IPA, amplified. More hops, more malt, more alcohol, more intensity. Can be dangerously drinkable despite high ABV. West Coast Doubles are resinous and bitter; Hazy Doubles are tropical fruit smoothies that hide their strength.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Intense</span>
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Strong</span>
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Complex</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-100 to-red-50 rounded-xl border border-amber-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Amber / Red Ale</Text>
              <span className="text-xs px-2 py-1 bg-amber-300 text-amber-900 rounded-full">4.5-6.5% ABV</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              A malt-forward ale with caramel sweetness and moderate hop character. American Ambers have more hop presence than Irish Reds, which emphasize smooth, toffee-like malt. Great transitional style for lager drinkers exploring ales.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Caramel</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Balanced</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Smooth</span>
            </div>
          </div>
        </div>

        {/* Dark Beers Section */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Dark Beers: Roasty, Rich & Satisfying
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Don't let the color intimidate you—dark beers range from smooth and easy-drinking to rich and complex. The dark malts provide coffee, chocolate, and roasted flavors that pair beautifully with desserts and hearty meals.
        </Text>
        <div className="mt-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-stone-200 to-stone-100 rounded-xl border border-stone-400">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-stone-900 text-lg">Stout</Text>
              <span className="text-xs px-2 py-1 bg-stone-400 text-stone-900 rounded-full">4-8% ABV</span>
            </div>
            <Text className="text-sm text-stone-700 mt-2">
              The dark beer family with incredible variety. Dry Irish Stouts (like Guinness) are light-bodied and roasty. Sweet/Milk Stouts add lactose for creamy sweetness. Oatmeal Stouts are silky smooth. Imperial Stouts are rich, boozy, and complex with coffee, chocolate, and dark fruit.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-700 rounded">Coffee</span>
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-700 rounded">Chocolate</span>
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-700 rounded">Roasted</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-stone-100 to-zinc-100 rounded-xl border border-stone-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-stone-900 text-lg">Porter</Text>
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-800 rounded-full">4.5-6.5% ABV</span>
            </div>
            <Text className="text-sm text-stone-700 mt-2">
              Stout's slightly lighter cousin. Brown to black with chocolate, caramel, and light roast character—less aggressive roastiness than stout. English Porters are earthy and subtle; American Porters can feature chocolate and coffee additions. Robust Porters bridge the gap to stout.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Chocolate</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Smooth</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Approachable</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-zinc-100 to-gray-100 rounded-xl border border-zinc-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-zinc-900 text-lg">Schwarzbier</Text>
              <span className="text-xs px-2 py-1 bg-zinc-300 text-zinc-800 rounded-full">4-5% ABV</span>
            </div>
            <Text className="text-sm text-zinc-700 mt-2">
              Germany's "black lager"—proof that dark doesn't mean heavy. Despite its jet-black appearance, Schwarzbier is light-bodied, crisp, and refreshing with subtle chocolate and coffee notes. Clean lager character makes it incredibly sessionable.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-700 rounded">Light-Bodied</span>
              <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-700 rounded">Crisp</span>
              <span className="text-xs px-2 py-1 bg-zinc-200 text-zinc-700 rounded">Sessionable</span>
            </div>
          </div>
        </div>

        {/* Specialty Section */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Specialty Styles: Wheat, Sour & Belgian
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Beyond the mainstream, these styles offer unique experiences—from refreshing wheat beers to complex sours and spicy Belgian ales. Perfect for adventurous drinkers looking to expand their horizons.
        </Text>
        <div className="mt-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Hefeweizen</Text>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">4.5-5.5% ABV</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              Bavaria's iconic wheat beer. Cloudy, golden, and crowned with fluffy white foam. The special yeast creates distinctive banana and clove aromas—no fruit added! Light, effervescent, and perfect for summer. Traditionally served in tall, curvy glasses.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Banana</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Clove</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Refreshing</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-yellow-900 text-lg">Witbier / Belgian White</Text>
              <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">4.5-5.5% ABV</span>
            </div>
            <Text className="text-sm text-yellow-800 mt-2">
              Belgium's refreshing wheat beer, spiced with coriander and orange peel. Hazy, pale, and incredibly drinkable with citrus and subtle spice notes. Often served with an orange slice (though purists disagree). The original summer beer.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Citrus</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Spiced</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Light</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl border border-pink-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-pink-900 text-lg">Sour Ales</Text>
              <span className="text-xs px-2 py-1 bg-pink-200 text-pink-800 rounded-full">3-8% ABV</span>
            </div>
            <Text className="text-sm text-pink-800 mt-2">
              An umbrella term for tart, acidic beers. Berliner Weisse is light and lemony. Gose adds salt and coriander. Flemish Reds have wine-like complexity. Lambics use wild yeast for funky, complex sourness. Often fruited with cherries, raspberries, or tropical fruit.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded">Tart</span>
              <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded">Fruity</span>
              <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded">Complex</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border border-amber-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Belgian Tripel</Text>
              <span className="text-xs px-2 py-1 bg-amber-300 text-amber-900 rounded-full">7.5-9.5% ABV</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              A strong, golden Belgian ale that hides its strength dangerously well. Complex yeast-driven flavors—fruity esters (pear, apple), spicy phenols (pepper, clove)—with a dry, effervescent finish. Deceptively smooth despite high alcohol.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Complex</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Spicy</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Strong</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-stone-100 to-amber-50 rounded-xl border border-stone-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-stone-900 text-lg">Belgian Dubbel</Text>
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-800 rounded-full">6-7.5% ABV</span>
            </div>
            <Text className="text-sm text-stone-700 mt-2">
              A rich, malty Belgian ale with dark fruit character—raisins, plums, figs. Originated in Trappist monasteries. Caramel and toffee sweetness balanced by subtle spice from Belgian yeast. Warming and contemplative, perfect for cooler weather.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Dark Fruit</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Malty</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Warming</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-green-900 text-lg">Saison / Farmhouse Ale</Text>
              <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full">5-8% ABV</span>
            </div>
            <Text className="text-sm text-green-800 mt-2">
              Originally brewed for Belgian farmworkers. Highly carbonated with a bone-dry finish. Complex yeast character—fruity, spicy, earthy, sometimes slightly funky. Incredibly food-friendly and refreshing despite often being stronger than expected.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Dry</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Spicy</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Rustic</span>
            </div>
          </div>
        </div>

        {/* Style Comparison Chart */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Style Comparison at a Glance
        </Text>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-amber-100">
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Style</th>
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">ABV</th>
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Bitterness</th>
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Body</th>
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="p-3 border border-amber-100">Pilsner</td>
                <td className="p-3 border border-amber-100">4-5.5%</td>
                <td className="p-3 border border-amber-100">Medium</td>
                <td className="p-3 border border-amber-100">Light</td>
                <td className="p-3 border border-amber-100">Hot days, food pairing</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="p-3 border border-amber-100">IPA</td>
                <td className="p-3 border border-amber-100">5.5-7.5%</td>
                <td className="p-3 border border-amber-100">High</td>
                <td className="p-3 border border-amber-100">Medium</td>
                <td className="p-3 border border-amber-100">Hop lovers, bold flavors</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 border border-amber-100">NEIPA</td>
                <td className="p-3 border border-amber-100">6-8%</td>
                <td className="p-3 border border-amber-100">Low</td>
                <td className="p-3 border border-amber-100">Medium-Full</td>
                <td className="p-3 border border-amber-100">Juice fans, hop newbies</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="p-3 border border-amber-100">Stout</td>
                <td className="p-3 border border-amber-100">4-8%</td>
                <td className="p-3 border border-amber-100">Medium</td>
                <td className="p-3 border border-amber-100">Medium-Full</td>
                <td className="p-3 border border-amber-100">Dessert, cold nights</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 border border-amber-100">Hefeweizen</td>
                <td className="p-3 border border-amber-100">4.5-5.5%</td>
                <td className="p-3 border border-amber-100">Low</td>
                <td className="p-3 border border-amber-100">Light-Medium</td>
                <td className="p-3 border border-amber-100">Summer, brunch</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="p-3 border border-amber-100">Sour</td>
                <td className="p-3 border border-amber-100">3-8%</td>
                <td className="p-3 border border-amber-100">Low</td>
                <td className="p-3 border border-amber-100">Light</td>
                <td className="p-3 border border-amber-100">Wine lovers, adventurers</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200 text-center">
          <Text tag="h3" className="text-xl font-bold text-amber-900">Ready to Explore These Styles?</Text>
          <Text className="mt-3 text-amber-800">
            Find local breweries and craft beer bars where you can taste these styles and discover your favorites.
          </Text>
          <a href="/places" className="inline-block mt-6 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-colors">
            Find Craft Beer Near You
          </a>
        </div>

      </div>
    </main>
  </>
);

export default StylesPage;
