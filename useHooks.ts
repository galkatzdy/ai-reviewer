export const useHooks = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return {
    isDarkMode,
  };
};
