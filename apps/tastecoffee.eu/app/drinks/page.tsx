import { FunctionComponent } from 'react';
import { TransparentHeader, Text } from 'ui-kit';
import { appConfig, getSiteTitle } from '../config';

const siteTitle = getSiteTitle();

const DrinksPage: FunctionComponent = () => (
  <>
    <TransparentHeader title={siteTitle} description={appConfig.metadata.description} className="no-background" />
    <main className="flex-grow">
      <div className="container-fluid w-full !max-w-[1248px] pt-12 lg:pt-20 2xl:pb-8 3xl:px-0 3xl:pt-24">
        <div className="text-center">
          <Text tag="h1" className="text-[28px] font-bold leading-10 md:text-4xl">
            Coffee Drinks Guide
          </Text>
          <Text className="mt-4 text-gray-600 max-w-2xl mx-auto">
            From espresso shots to silky lattes—master the world of coffee drinks and order with confidence
          </Text>
        </div>

        {/* Introduction */}
        <Text className="mt-8 text-sm lg:mt-10 lg:text-base">
          Walking into a specialty coffee shop can feel overwhelming with menus featuring dozens of drinks. But once you understand the building blocks—espresso, steamed milk, and water—every drink makes sense. This guide breaks down the most popular coffee drinks, their proportions, and what makes each one unique. Whether you're a newcomer to specialty coffee or looking to expand your repertoire, you'll leave knowing exactly what to order.
        </Text>

        {/* Quick Reference */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <Text className="font-bold text-amber-900 text-lg">Quick Drink Finder</Text>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Text className="text-sm font-medium text-amber-800">Strong & Bold</Text>
              <Text className="text-xs text-amber-700">Espresso, Ristretto, Doppio</Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-amber-800">Milk & Espresso</Text>
              <Text className="text-xs text-amber-700">Latte, Cappuccino, Flat White</Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-amber-800">Light & Smooth</Text>
              <Text className="text-xs text-amber-700">Americano, Long Black, Filter</Text>
            </div>
            <div>
              <Text className="text-sm font-medium text-amber-800">Cold & Refreshing</Text>
              <Text className="text-xs text-amber-700">Cold Brew, Iced Latte, Affogato</Text>
            </div>
          </div>
        </div>

        {/* The Foundation: Espresso */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          The Foundation: Espresso
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Every coffee shop drink starts here. Espresso is concentrated coffee brewed by forcing hot water through finely-ground coffee under pressure. The result is a small, intense shot with a layer of golden crema on top. Understanding espresso variations helps you control the strength and flavor of any drink.
        </Text>
        <div className="mt-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border border-amber-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Espresso</Text>
              <span className="text-xs px-2 py-1 bg-amber-300 text-amber-900 rounded-full">25-30ml</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              The purest expression of coffee. A single shot (solo) delivers intense, concentrated flavor in about 25 seconds of extraction. Expect caramel sweetness, rich body, and a long finish. Best enjoyed immediately—the crema dissipates within minutes.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Intense</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Quick</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Pure</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl border border-orange-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-orange-900 text-lg">Doppio (Double)</Text>
              <span className="text-xs px-2 py-1 bg-orange-300 text-orange-900 rounded-full">50-60ml</span>
            </div>
            <Text className="text-sm text-orange-800 mt-2">
              Two shots of espresso—the standard in most specialty coffee shops today. More volume, same concentration as a single. This is what most cafés use as the base for milk drinks. If you ask for "an espresso" at a specialty shop, you'll often get a doppio.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">Double Strength</span>
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">Standard Base</span>
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">Bold</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-stone-100 to-amber-50 rounded-xl border border-stone-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-stone-900 text-lg">Ristretto</Text>
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-800 rounded-full">15-20ml</span>
            </div>
            <Text className="text-sm text-stone-700 mt-2">
              A "restricted" shot—same amount of coffee, less water, shorter extraction. The result is sweeter, more syrupy, and less bitter than regular espresso. Extracts more of the coffee's sweet and fruity notes while leaving behind some of the bitter compounds.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Sweeter</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Concentrated</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Syrupy</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Lungo</Text>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">60-80ml</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              A "long" shot—same coffee, more water, longer extraction. Less intense than espresso but more bitter as the extended extraction pulls out more compounds. Popular in parts of Europe where espresso is traditionally a bit longer and milder.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Milder</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Extended</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">More Volume</span>
            </div>
          </div>
        </div>

        {/* Milk-Based Drinks */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Milk-Based Classics
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Steamed milk transforms espresso into creamy, approachable drinks. The magic is in the texture—microfoam (tiny, velvety bubbles) creates that silky mouthfeel. The ratio of espresso to milk and the amount of foam defines each classic drink.
        </Text>
        <div className="mt-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Cappuccino</Text>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">150-180ml</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              The iconic Italian classic: equal parts espresso, steamed milk, and milk foam (roughly 1:1:1). The thick layer of foam on top insulates the drink and provides textural contrast. Traditional cappuccinos are smaller and stronger than the supersized versions at chain cafés.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Foamy</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Balanced</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Morning Drink</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-orange-900 text-lg">Latte (Caffè Latte)</Text>
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full">240-350ml</span>
            </div>
            <Text className="text-sm text-orange-800 mt-2">
              Espresso with lots of steamed milk and just a thin layer of foam. Creamier and milder than cappuccino—the milk sweetness softens the coffee's intensity. The canvas for latte art. Larger sizes are common; it's meant to be a sipping drink, not a quick shot.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Creamy</span>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Mild</span>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Versatile</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-stone-100 to-amber-50 rounded-xl border border-stone-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-stone-900 text-lg">Flat White</Text>
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-800 rounded-full">150-180ml</span>
            </div>
            <Text className="text-sm text-stone-700 mt-2">
              Originated in Australia/New Zealand—a smaller, stronger milk drink with velvety microfoam (no stiff foam layer). Higher espresso-to-milk ratio than a latte means more coffee flavor comes through. The milk is silky smooth throughout, not separated into layers.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Strong</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Velvety</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Compact</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border border-amber-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Macchiato</Text>
              <span className="text-xs px-2 py-1 bg-amber-300 text-amber-900 rounded-full">35-60ml</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              "Stained" espresso—a shot with just a dollop of milk foam on top. The foam slightly softens the espresso's edge while preserving its intensity. Not to be confused with the caramel macchiato (a sweetened latte). Traditional macchiatos are tiny and potent.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Espresso-Forward</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Small</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Traditional</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-yellow-900 text-lg">Cortado</Text>
              <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">60-90ml</span>
            </div>
            <Text className="text-sm text-yellow-800 mt-2">
              Spanish-origin drink: espresso "cut" with an equal amount of warm milk (1:1 ratio). Little to no foam. Stronger than a flat white, creamier than a macchiato. Perfect for those who want milk but don't want it to dominate. Usually served in a small glass.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Equal Parts</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">No Foam</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Balanced</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-100 to-red-50 rounded-xl border border-orange-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-orange-900 text-lg">Latte Macchiato</Text>
              <span className="text-xs px-2 py-1 bg-orange-300 text-orange-900 rounded-full">250-300ml</span>
            </div>
            <Text className="text-sm text-orange-800 mt-2">
              The inverse of a regular macchiato—milk "stained" with espresso. A glass of steamed milk with espresso poured through, creating beautiful layers. Milder coffee flavor as the espresso disperses slowly. Served in a tall glass to show off the layers.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">Layered</span>
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">Milk-Forward</span>
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">Visual</span>
            </div>
          </div>
        </div>

        {/* Water-Based & Black */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Black Coffee & Water-Based Drinks
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Not everyone wants milk. These drinks highlight coffee's natural flavors—from the intensity of espresso diluted with water to the smooth, low-acid experience of slow-brewed methods. Perfect for purists and those who want to taste the coffee itself.
        </Text>
        <div className="mt-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Americano</Text>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">180-240ml</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              Espresso topped with hot water—similar strength to filter coffee but with espresso's body and crema. Legend says it was invented for American soldiers in Italy who found espresso too strong. Espresso goes in first, then water. Smooth and satisfying.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Smooth</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Black</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Classic</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-stone-100 to-amber-50 rounded-xl border border-stone-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-stone-900 text-lg">Long Black</Text>
              <span className="text-xs px-2 py-1 bg-stone-300 text-stone-800 rounded-full">180-240ml</span>
            </div>
            <Text className="text-sm text-stone-700 mt-2">
              The Australian/NZ version of an Americano—but with a key difference: hot water goes in first, then espresso is poured on top. This preserves the crema and creates a more aromatic, layered drinking experience. Subtly different but noticeably better.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Preserved Crema</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Aromatic</span>
              <span className="text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded">Refined</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-orange-900 text-lg">Filter / Pour Over</Text>
              <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full">200-300ml</span>
            </div>
            <Text className="text-sm text-orange-800 mt-2">
              Hot water slowly poured over ground coffee, dripping through a filter. Methods include V60, Chemex, and Kalita Wave. Cleaner, lighter body than espresso; highlights delicate flavor notes—fruit, floral, tea-like qualities. Often showcases single-origin beans.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Clean</span>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Nuanced</span>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Light Body</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border border-amber-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">AeroPress</Text>
              <span className="text-xs px-2 py-1 bg-amber-300 text-amber-900 rounded-full">150-250ml</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              A modern brewing method using air pressure to push water through coffee. Incredibly versatile—can produce espresso-like concentrate or clean filter-style coffee. Fast brewing (1-2 minutes), easy cleanup, and surprisingly complex results. A favorite among coffee enthusiasts.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Versatile</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Quick</span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">Modern</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl border border-yellow-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-yellow-900 text-lg">French Press</Text>
              <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">200-350ml</span>
            </div>
            <Text className="text-sm text-yellow-800 mt-2">
              Full immersion brewing: coarse grounds steep in hot water, then a metal mesh filter separates the coffee. Produces rich, full-bodied coffee with natural oils intact. Slightly gritty texture. Bold flavor profile—great for darker roasts and milk if desired.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Full-Bodied</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Rich</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Classic</span>
            </div>
          </div>
        </div>

        {/* Cold Drinks */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Cold & Iced Drinks
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Cold coffee isn't just hot coffee over ice. These drinks are specifically crafted for refreshment—from slow-steeped cold brews to flash-chilled espresso drinks. Perfect for warm weather or anytime you want something cool and caffeinated.
        </Text>
        <div className="mt-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-blue-900 text-lg">Cold Brew</Text>
              <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">240-350ml</span>
            </div>
            <Text className="text-sm text-blue-800 mt-2">
              Coarse coffee steeped in cold water for 12-24 hours. Never touches heat, resulting in a smooth, sweet, low-acid brew. Usually served as concentrate diluted with water or milk. Higher caffeine than regular coffee due to the long extraction and high coffee-to-water ratio.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Smooth</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Sweet</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Low Acid</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-cyan-900 text-lg">Iced Latte</Text>
              <span className="text-xs px-2 py-1 bg-cyan-200 text-cyan-800 rounded-full">300-400ml</span>
            </div>
            <Text className="text-sm text-cyan-800 mt-2">
              Espresso poured over cold milk and ice. The espresso is still hot when poured, creating interesting flavor dynamics as it mixes with cold milk. Refreshing and creamy—works well with flavored syrups. Ratio is typically similar to a hot latte, just served cold.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded">Refreshing</span>
              <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded">Creamy</span>
              <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded">Customizable</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-teal-900 text-lg">Iced Americano</Text>
              <span className="text-xs px-2 py-1 bg-teal-200 text-teal-800 rounded-full">240-350ml</span>
            </div>
            <Text className="text-sm text-teal-800 mt-2">
              Espresso with cold water and ice—the refreshing black coffee option. Clean and bold without any milk. Some shops use cold water to preserve the crema; others use ice to chill. A great way to appreciate espresso on a hot day.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">Bold</span>
              <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">Black</span>
              <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">Clean</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-amber-900 text-lg">Affogato</Text>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">60-120ml</span>
            </div>
            <Text className="text-sm text-amber-800 mt-2">
              Italian for "drowned"—a shot of hot espresso poured over cold gelato or ice cream. Dessert and coffee in one. The hot coffee melts into the ice cream creating a creamy, bittersweet experience. Traditionally vanilla, but any flavor works.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Dessert</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Indulgent</span>
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Italian</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl border border-blue-300">
            <div className="flex justify-between items-start">
              <Text className="font-bold text-blue-900 text-lg">Nitro Cold Brew</Text>
              <span className="text-xs px-2 py-1 bg-blue-300 text-blue-900 rounded-full">300-400ml</span>
            </div>
            <Text className="text-sm text-blue-800 mt-2">
              Cold brew infused with nitrogen gas, served on tap like beer. The nitrogen creates a cascading, creamy texture with a thick, stout-like head. Naturally sweet and velvety without any milk or sugar. Served without ice—the nitrogen keeps it cold.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded">Creamy</span>
              <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded">Velvety</span>
              <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded">On Tap</span>
            </div>
          </div>
        </div>

        {/* Specialty & Regional */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Specialty & Regional Drinks
        </Text>
        <Text className="mt-2 text-sm lg:mt-3 lg:text-base">
          Every coffee culture has developed unique drinks. These specialties offer new ways to enjoy coffee, from Vietnamese condensed milk to Spanish bumpy drinks. Try them to expand your coffee horizons.
        </Text>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <Text className="font-bold text-amber-900">Vietnamese Coffee (Cà Phê Sữa Đá)</Text>
            <Text className="text-sm text-amber-800 mt-2">
              Strong, dark-roasted coffee brewed through a phin filter, mixed with sweetened condensed milk, served over ice. Rich, sweet, and incredibly bold. The condensed milk balances the coffee's bitterness perfectly.
            </Text>
          </div>

          <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <Text className="font-bold text-orange-900">Café con Leche</Text>
            <Text className="text-sm text-orange-800 mt-2">
              Spanish/Latin American specialty: strong espresso mixed with hot, scalded milk (not steamed). Equal parts or milk-heavy. Sweeter and smoother than Italian-style milk drinks. Often dunked with toast for breakfast.
            </Text>
          </div>

          <div className="p-5 bg-gradient-to-br from-stone-100 to-amber-50 rounded-xl border border-stone-300">
            <Text className="font-bold text-stone-900">Turkish Coffee</Text>
            <Text className="text-sm text-stone-700 mt-2">
              Finely ground coffee simmered in a cezve pot with water and sugar. Unfiltered, so grounds settle at the bottom. Rich, thick, and aromatic—often spiced with cardamom. Sipped slowly, leaving the grounds behind.
            </Text>
          </div>

          <div className="p-5 bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl border border-yellow-200">
            <Text className="font-bold text-yellow-900">Café Cubano</Text>
            <Text className="text-sm text-yellow-800 mt-2">
              Cuban espresso with a thick layer of espuma (sugar foam) on top. Sugar is whipped with the first drops of espresso to create a sweet, caramelized foam. Intense, sweet, and served in tiny cups.
            </Text>
          </div>
        </div>

        {/* Drink Comparison Chart */}
        <Text tag="h2" className="text-xl pt-12 md:!text-2xl xl:!text-3xl">
          Drink Comparison at a Glance
        </Text>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-amber-100">
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Drink</th>
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Size</th>
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Strength</th>
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Milk</th>
                <th className="p-3 text-left font-semibold text-amber-900 border border-amber-200">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="p-3 border border-amber-100">Espresso</td>
                <td className="p-3 border border-amber-100">25-30ml</td>
                <td className="p-3 border border-amber-100">Very Strong</td>
                <td className="p-3 border border-amber-100">None</td>
                <td className="p-3 border border-amber-100">Purists, quick caffeine</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="p-3 border border-amber-100">Cappuccino</td>
                <td className="p-3 border border-amber-100">150-180ml</td>
                <td className="p-3 border border-amber-100">Medium</td>
                <td className="p-3 border border-amber-100">Foamy</td>
                <td className="p-3 border border-amber-100">Mornings, texture lovers</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 border border-amber-100">Flat White</td>
                <td className="p-3 border border-amber-100">150-180ml</td>
                <td className="p-3 border border-amber-100">Medium-Strong</td>
                <td className="p-3 border border-amber-100">Silky</td>
                <td className="p-3 border border-amber-100">Coffee lovers who like milk</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="p-3 border border-amber-100">Latte</td>
                <td className="p-3 border border-amber-100">240-350ml</td>
                <td className="p-3 border border-amber-100">Mild</td>
                <td className="p-3 border border-amber-100">Lots</td>
                <td className="p-3 border border-amber-100">Sipping, flavor additions</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 border border-amber-100">Americano</td>
                <td className="p-3 border border-amber-100">180-240ml</td>
                <td className="p-3 border border-amber-100">Medium</td>
                <td className="p-3 border border-amber-100">None</td>
                <td className="p-3 border border-amber-100">Black coffee fans</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="p-3 border border-amber-100">Cold Brew</td>
                <td className="p-3 border border-amber-100">240-350ml</td>
                <td className="p-3 border border-amber-100">High</td>
                <td className="p-3 border border-amber-100">Optional</td>
                <td className="p-3 border border-amber-100">Hot days, low acid</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200 text-center">
          <Text tag="h3" className="text-xl font-bold text-amber-900">Ready to Try These Drinks?</Text>
          <Text className="mt-3 text-amber-800">
            Find specialty coffee shops near you where skilled baristas craft these drinks with care and quality beans.
          </Text>
          <a href="/places" className="inline-block mt-6 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-colors">
            Find Specialty Coffee Near You
          </a>
        </div>

      </div>
    </main>
  </>
);

export default DrinksPage;
