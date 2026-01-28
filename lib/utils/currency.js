export function rupeesToPaise(rupees) {
  return Math.round(Number(rupees) * 100);
}

export function paiseToRupees(paise) {
  return Number(paise) / 100;
}

export function formatCurrency(paise) {
  const rupees = paiseToRupees(paise);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatCurrencyDetailed(paise) {
  const rupees = paiseToRupees(paise);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

export function validateAmount(rupees, min = 1, max = 10000000) {
  const amount = Number(rupees);
  if (isNaN(amount) || amount < min || amount > max) {
    return {
      valid: false,
      error: `Amount must be between ₹${min} and ₹${max.toLocaleString()}`,
    };
  }
  return { valid: true, paise: rupeesToPaise(amount) };
}
