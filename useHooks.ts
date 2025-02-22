export const useHooks = () => {
  const darkMode = useColorScheme() === 'dark';
  return {
    darkMode,
  };
};
