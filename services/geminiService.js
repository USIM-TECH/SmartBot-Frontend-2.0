
/**
 * Mocking the Gemini service to return static data for now.
 * This allows the app to run without any API keys or network requests.
 */
export const generateComparison = async (prompt, selectedStores) => {
  // Simulate a short delay to feel like an AI response
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log(`[MOCK] Processing request for: "${prompt}"`);

  return {
    text: `Here is a price comparison for "${prompt}" from your selected stores.`,
    comparisonData: {
      productName: prompt.charAt(0).toUpperCase() + prompt.slice(1),
      productImage: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/300/300`,
      stores: selectedStores.map((store, index) => ({
        storeName: store,
        storeIcon: "storefront",
        price: 25.50 + index, 
        currency: "RM"
      })),
      recommendations: [
        `Prices for "${prompt}" are currently stable.`,
        "Consider checking for bulk discounts.",
        "Prices may vary depending on store location."
      ]
    }
  };
};
