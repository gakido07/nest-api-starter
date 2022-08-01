export const generateVerificationcode = (): number => {
  const max = 9999;
  const min = 999;
  return Math.round(Math.random() * (max - min) + min);
};
