// Translation utility for testing interpolation
import { translations } from '@/data/translations';

export const testTranslation = () => {
  // Test interpolation
  const template = translations.en['newMaterial.totalPercentage'];
  const result = template.replace(/\{(\w+)\}/g, (match, key) => {
    if (key === 'percentage') return '85.5';
    return match;
  });
  
  console.log('Translation test:', template, '->', result);
  return result;
};