export const CATEGORIES = [
  { value: "food", label: "Alimentação", dot: "bg-cat-food" },
  { value: "transport", label: "Transporte", dot: "bg-cat-transport" },
  { value: "subscription", label: "Assinatura", dot: "bg-cat-subscription" },
  { value: "other", label: "Outros", dot: "bg-cat-other" },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function categoryDot(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.dot ?? "bg-cat-other";
}
