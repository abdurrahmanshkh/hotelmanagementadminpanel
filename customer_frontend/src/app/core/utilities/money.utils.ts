export function formatCurrency(amount: number, currency = 'INR'): string {
  if (isNaN(amount) || amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}
