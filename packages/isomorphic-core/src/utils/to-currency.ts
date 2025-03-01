export function toCurrency(
  number: number | string,
  lang: string = 'en', // default to English
  disableDecimal = false,
  decimalPlaces = 2
) {
  const currencyDisplay = lang === 'ar' ? 'ج.م' : 'EGP';

  const formatter = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'EGP',
    currencyDisplay: 'code',
    minimumFractionDigits: disableDecimal ? 0 : decimalPlaces,
    maximumFractionDigits: disableDecimal ? 0 : decimalPlaces,
  });

  return formatter.format(+number).replace('EGP', currencyDisplay);
}
