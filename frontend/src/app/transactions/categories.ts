export const CATEGORIES = [
  { value: "food", label: "Alimentação", dot: "bg-cat-food", text: "text-cat-food", soft: "bg-cat-food/15" },
  { value: "transport", label: "Transporte", dot: "bg-cat-transport", text: "text-cat-transport", soft: "bg-cat-transport/15" },
  { value: "subscription", label: "Assinatura", dot: "bg-cat-subscription", text: "text-cat-subscription", soft: "bg-cat-subscription/15" },
  { value: "other", label: "Outros", dot: "bg-cat-other", text: "text-cat-other", soft: "bg-cat-other/15" },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];

function findCategory(value: string) {
  return CATEGORIES.find((c) => c.value === value);
}

export function categoryLabel(value: string) {
  return findCategory(value)?.label ?? value;
}

export function categoryDot(value: string) {
  return findCategory(value)?.dot ?? "bg-cat-other";
}

export function categoryTextClass(value: string) {
  return findCategory(value)?.text ?? "text-cat-other";
}

export function categorySoftClass(value: string) {
  return findCategory(value)?.soft ?? "bg-cat-other/15";
}
