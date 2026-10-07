import { useEffect, useState } from "react";

export type Product = { id: string; name: string; brand: string; category: string; price: number; oldPrice?: number; image: string; badge?: string; description: string };
export type Category = { id: string; name: string; description: string; icon: string; image?: string };
export type Advice = { id: string; title: string; summary: string; image: string; content: string; tag: string };
export type Catalog = { products: Product[]; categories: Category[]; advice: Advice[]; hero: string; contact: { email: string; phone: string; hours: string } };
const key = "apoteka-admin-design-v1";
export const remoteCatalog = false;
function valid(value: Catalog) {
  return value && Array.isArray(value.products) && Array.isArray(value.categories) && Array.isArray(value.advice);
}
export function useCatalog() {
  const [data, setData] = useState<Catalog | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (valid(saved)) { setData(saved); return; }
    } catch { /* Use the original catalog when browser storage is unavailable. */ }
    fetch(`${import.meta.env.BASE_URL}catalog.json`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(result => { if (!valid(result)) throw new Error(); setData(result); })
      .catch(err => { if (err.name !== "AbortError") setError("Podatke nije moguće učitati. Osvježite stranicu i pokušajte ponovo."); });
    return () => controller.abort();
  }, []);
  const save = async (next: Catalog) => {
    localStorage.setItem(key, JSON.stringify(next));
    setData(next);
  };
  return { data, error, save };
}
