// src/utils/formatters.ts

// A lista dos nossos "nomes" de números
const SUFIXOS_PT = [
  "Mi",
  "Bi",
  "Tri",
  "Qua",
  "Qui",
  "Sex",
  "Sep",
  "Octi",
  "Noni",
  "Deci",
  "Undeci",
  "Duodeci",
];

/**
 * Formata um número grande (Milhão+) em uma string curta (ex: "1,234 Milhão").
 * @param num O número a ser formatado.
 */
export const formatNumber = (num: number): string => {
  // 1. Números "Pequenos" (abaixo de 1 milhão)
  if (num < 1_000_000) {
    // Usa toLocaleString com 1 casa decimal no máximo (para CPS)
    return num.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  }

  // 2. Encontra o "tier" (0 = Milhão, 1 = Bilhão, ...)
  // (Math.log10(num) / 3) dá o "grupo" (ex: 1.000.000 = grupo 2)
  // Subtraímos 2 para que o "Milhão" (grupo 2) seja nosso índice 0.
  const tier = Math.floor(Math.log10(num) / 3) - 2;

  // 3. Se o número for gigante e sair da nossa lista
  if (tier >= SUFIXOS_PT.length) {
    return num.toExponential(2).replace(".", ",");
  }

  const sufixo = SUFIXOS_PT[tier];

  // 4. Calcula o divisor
  // tier 0 (Milhão) = 1000^(0+2) = 10^6
  // tier 1 (Bilhão) = 1000^(1+2) = 10^9
  const divisor = Math.pow(1000, tier + 2);
  const numEscalado = num / divisor;

  // 5. Formata com 3 casas decimais (igual ao Cookie Clicker)
  const numFormatado = numEscalado.toFixed(3).replace(".", ",");

  return `${numFormatado} ${sufixo}`;
};
