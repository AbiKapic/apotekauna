import { Leaf, HeartPulse, Droplets, Baby, Sun, Pill } from "lucide-react"
export const categoryIcons = {
  leaf: Leaf,
  heart: HeartPulse,
  beauty: Droplets,
  baby: Baby,
  sun: Sun,
  pill: Pill,
}
export function CategoryIcon({ icon }: { icon: string }) {
  const Icon = categoryIcons[(icon as keyof typeof categoryIcons)] || Leaf
  return <Icon size={22} strokeWidth={1.5} className="text-[#7e9466]" />
}
