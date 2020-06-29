let currentId = 1;

export const getUniqueId = (): number => currentId++;

export const getCleanTitle = (text: string): string => text.split('-')
  .map((part: string) => part[0].toUpperCase() + part.substr(1))
  .join(' ');
