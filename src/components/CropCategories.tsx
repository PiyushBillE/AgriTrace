// Crop categories for Indian agriculture
export const cropCategories = {
  'cereals-grains': {
    label: 'Cereals & Grains',
    items: ['Wheat', 'Rice (Basmati)', 'Rice (Non-Basmati)', 'Maize (Corn)', 'Barley', 'Bajra (Pearl Millet)', 'Jowar (Sorghum)', 'Ragi (Finger Millet)']
  },
  'pulses': {
    label: 'Pulses (Dal Varieties)',
    items: ['Chana (Chickpeas)', 'Arhar/Tur (Pigeon Pea)', 'Masoor (Lentil)', 'Moong (Green Gram)', 'Urad (Black Gram)']
  },
  'oilseeds': {
    label: 'Oilseeds',
    items: ['Mustard', 'Groundnut (Peanut)', 'Soybean', 'Sunflower', 'Sesame']
  },
  'fruits': {
    label: 'Fruits',
    items: ['Mango', 'Banana', 'Apple', 'Grapes', 'Orange', 'Lemon', 'Guava', 'Papaya', 'Pomegranate']
  },
  'vegetables': {
    label: 'Vegetables',
    items: ['Potato', 'Onion', 'Tomato', 'Brinjal (Eggplant)', 'Cabbage', 'Cauliflower', 'Green Chilies', 'Capsicum']
  },
  'cash-crops': {
    label: 'Cash Crops',
    items: ['Sugarcane', 'Cotton', 'Jute']
  },
  'spices-plantation': {
    label: 'Spices & Plantation Crops',
    items: ['Turmeric', 'Ginger', 'Cardamom', 'Tea', 'Coffee']
  }
};

export const getAllCrops = () => {
  return Object.values(cropCategories).reduce((all, category) => {
    return [...all, ...category.items];
  }, [] as string[]);
};