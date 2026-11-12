import { useState } from "react"
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  Percent,
  Star,
} from "lucide-react"
import type { Catalog, Collection } from "./catalog"
import { collectionsFor } from "../lib/collections"
const field = "rounded-lg border border-[#dfe4db] bg-white px-3 py-2 text-sm"
export function CollectionsEditor({
  data,
  kind,
  save,
}: {
  data: Catalog
  kind: "sale" | "popular"
  save: (data: Catalog) => Promise<void>
}) {
  const [collection, setCollection] = useState<Collection>(() =>
    structuredClone(collectionsFor(data)[kind]),
  )
  const [query, setQuery] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const Icon = kind === "sale" ? Percent : Star
  const matches = data.products.filter(
    (p) =>
      p.status === "published" &&
      !collection.items.some((i) => i.productId === p.id) &&
      (p.name + " " + p.brand + " " + p.sku)
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  )
  const move = (index: number, delta: number) => {
    const items = [...collection.items]
    ;[items[index], items[index + delta]] = [items[index + delta], items[index]]
    setCollection({ ...collection, items })
  }
  const submit = async () => {
    setMessage("")
    setBusy(true)
    try {
      if (!collection.title.trim()) throw new Error("Unesite naziv sekcije.")
      if (
        kind === "sale" &&
        collection.items.some(
          (i) =>
            !Number.isFinite(i.discount) || i.discount < 1 || i.discount > 99,
        )
      )
        throw new Error("Popust mora biti između 1 i 99%.")
      await save({
        ...data,
        collections: {
          ...collectionsFor(data),
          [kind]: { ...collection, title: collection.title.trim() },
        },
      })
      setMessage("Promjene su sačuvane.")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Spremanje nije uspjelo.",
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="rounded-xl border border-[#dfe5d7] bg-[#fdfefa] p-6">
      <div className="mb-6 flex items-center gap-3">
        <Icon size={22} />
        <h2 className="text-lg">Uređivanje sekcije</h2>
      </div>
      <fieldset disabled={busy} className="space-y-6 disabled:opacity-60">
        <label className="block text-xs">
          Naziv sekcije
          <input
            className={field + " mt-2 block w-full"}
            value={collection.title}
            onChange={(e) =>
              setCollection({ ...collection, title: e.target.value })
            }
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={collection.enabled}
            onChange={(e) =>
              setCollection({ ...collection, enabled: e.target.checked })
            }
          />
          Prikaži na stranici
        </label>
        <p className="text-xs leading-6 text-[#7b8970]">
          Prvih pet proizvoda prikazuje se na početnoj stranici. Svi odabrani
          proizvodi dostupni su na posebnoj stranici.
          {kind === "sale" &&
            " Popust se računa od redovne cijene i primjenjuje u cijeloj prodavnici."}
        </p>
        <div className="space-y-3">
          {collection.items.map((item, index) => {
            const product = data.products.find((p) => p.id === item.productId)
            return (
              <div
                key={item.productId}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e0e5d9] p-3"
              >
                <span className="min-w-40 flex-1 text-sm">
                  {product?.name || "Uklonjen proizvod"}
                  {product?.status !== "published" && (
                    <small className="block text-[#a46550]">
                      Nije objavljeno · skriveno na stranici
                    </small>
                  )}
                </span>
                {kind === "sale" && (
                  <label className="flex items-center gap-2 text-xs">
                    Popust
                    <input
                      aria-label={"Popust za " + product?.name}
                      className={field + " w-20"}
                      type="number"
                      min="1"
                      max="99"
                      step="1"
                      value={item.discount}
                      onChange={(e) =>
                        setCollection({
                          ...collection,
                          items: collection.items.map((i, n) =>
                            n === index
                              ? { ...i, discount: Number(e.target.value) }
                              : i,
                          ),
                        })
                      }
                    />
                    %
                    <span>
                      {product &&
                        (
                          (product.oldPrice || product.price) *
                          (1 - item.discount / 100)
                        ).toFixed(2)}{" "}
                      KM
                    </span>
                  </label>
                )}
                <button
                  aria-label="Pomjeri gore"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className="p-2 disabled:opacity-25"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  aria-label="Pomjeri dolje"
                  disabled={index === collection.items.length - 1}
                  onClick={() => move(index, 1)}
                  className="p-2 disabled:opacity-25"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  aria-label={"Ukloni " + product?.name}
                  onClick={() =>
                    setCollection({
                      ...collection,
                      items: collection.items.filter(
                        (i) => i.productId !== item.productId,
                      ),
                    })
                  }
                  className="p-2 text-[#a46550]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>
        <label className="block text-xs">
          Dodajte proizvode
          <input
            className={field + " mt-2 block w-full"}
            placeholder="Pretražite naziv, brend ili šifru…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="max-h-64 overflow-auto">
          {matches.slice(0, 30).map((p) => (
            <button
              key={p.id}
              className="flex w-full items-center justify-between border-b border-[#e0e5d9] py-3 text-left text-xs"
              onClick={() =>
                setCollection({
                  ...collection,
                  items: [
                    ...collection.items,
                    { productId: p.id, discount: kind === "sale" ? 10 : 0 },
                  ],
                })
              }
            >
              {p.name}
              <Plus size={16} />
            </button>
          ))}
          {!matches.length && (
            <p className="text-xs">Nema pronađenih proizvoda.</p>
          )}
          {matches.length > 30 && (
            <p className="py-3 text-xs">
              Unesite precizniju pretragu za ostale proizvode.
            </p>
          )}
        </div>
        <button
          onClick={submit}
          className="flex items-center gap-2 rounded-lg bg-[#294f41] px-4 py-3 text-xs text-white"
        >
          <Save size={16} />
          {busy ? "Spremanje…" : "Sačuvaj promjene"}
        </button>
      </fieldset>
      {message && (
        <p role="status" className="mt-4 text-sm">
          {message}
        </p>
      )}
    </section>
  )
}
