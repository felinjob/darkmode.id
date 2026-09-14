import 'server-only';

const dictionaries = {
  en: () => import('@/messages/en.json').then((module) => module.default),
  pt: () => import('@/messages/pt.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (locale !== 'en' && locale !== 'pt') {
    return dictionaries.pt();
  }
  return dictionaries[locale as keyof typeof dictionaries]();
};
