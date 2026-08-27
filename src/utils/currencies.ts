// Taux de conversion fixes par rapport au XOF (monnaie de base pour les calculs internes)
// Ceci est une implémentation statique basique. Pour une app en production,
// on utiliserait une API externe (ex: fixer.io) pour avoir les taux du jour, 
// ou on permettrait à l'utilisateur de définir ses propres taux dans les paramètres.

const EXCHANGE_RATES: Record<string, number> = {
  'XOF': 1,
  'XAF': 1, // XAF et XOF ont la même parité par rapport à l'Euro
  'GNF': 14.3, // 1 XOF = ~14.3 GNF
  'EUR': 0.0015, // 1 XOF = ~0.0015 EUR (1 EUR = 655.957 XOF)
  'USD': 0.0016, // 1 XOF = ~0.0016 USD (estimé)
}

/**
 * Convertit un montant d'une devise à une autre
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  if (!fromCurrency) fromCurrency = 'XOF';
  if (!toCurrency) toCurrency = 'XOF';

  const rateFrom = EXCHANGE_RATES[fromCurrency] || 1;
  const rateTo = EXCHANGE_RATES[toCurrency] || 1;

  // Convertir d'abord vers la base (XOF)
  const amountInBase = amount / rateFrom;
  
  // Puis convertir vers la devise cible
  return amountInBase * rateTo;
}

/**
 * Formate un montant dans une devise spécifique
 */
export function formatCurrency(amount: number, currency: string): string {
  const c = currency || 'XOF';
  const val = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: c === 'XOF' || c === 'XAF' || c === 'GNF' ? 0 : 2
  }).format(amount);
  
  return `${val} ${c}`;
}
