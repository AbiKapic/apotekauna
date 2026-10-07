import { readStorefrontCatalog } from "../lib/catalog"
import { AdminAccess } from "../admin/AdminAccess"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  lazy,
  Suspense,
  type ReactNode,
} from "react"
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  NavLink,
  Outlet,
  useParams,
  useSearchParams,
} from "react-router"
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  X,
  Menu,
  MessageSquare,
  Check,
  Leaf,
  HeartPulse,
  Droplets,
  Baby,
  Sun,
  Pill,
  Clock,
  Mail,
  Phone,
} from "lucide-react"

type Product = {
  id: string
  name: string
  brand: string
  category: string
  price: number
  oldPrice?: number
  image: string
  badge?: string
  description: string
}
type Category = {
  id: string
  name: string
  description: string
  icon: string
  image?: string
}
type Advice = {
  id: string
  title: string
  summary: string
  image: string
  content: string
  tag: string
}
type Catalog = {
  products: Product[]
  categories: Category[]
  advice: Advice[]
  hero: string
  contact: {
    email: string
    phone: string
    hours: string
  }
}
type Item = {
  product: Product
  quantity: number
}
const Store = createContext<{
  data: Catalog | null
  error: string
  items: Item[]
  add: (product: Product) => void
  change: (id: string, delta: number) => void
  open: () => void
}>(null!)
const money = (value: number) =>
  `${value.toLocaleString("bs-BA", { minimumFractionDigits: 2 })} KM`
const primary =
  "inline-flex items-center justify-center gap-3 rounded-lg bg-[#294f41] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#183c30]"
const wrap = "mx-auto max-w-[1240px] px-6 lg:px-10"
const icons: Record<string, typeof Leaf> = {
  leaf: Leaf,
  heart: HeartPulse,
  beauty: Droplets,
  baby: Baby,
  sun: Sun,
  pill: Pill,
}

function Root() {
  const [data, setData] = useState<Catalog | null>(null)
  const [error, setError] = useState("")
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pharmacy-cart") || "[]")
      return Array.isArray(saved)
        ? saved.filter(
            (item) =>
              item?.product?.id &&
              Number.isFinite(item.product.price) &&
              item.quantity > 0,
          )
        : []
    } catch {
      return []
    }
  })
  const [cart, setCart] = useState(false)
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    readStorefrontCatalog(controller.signal)
      .then((result) => {
        if (
          !Array.isArray(result.products) ||
          !Array.isArray(result.categories) ||
          !Array.isArray(result.advice)
        )
          throw new Error()
        setData(result)
      })
      .catch((err) => {
        if (err.name !== "AbortError")
          setError(
            "Ponudu trenutno nije moguće učitati. Molimo pokušajte ponovo.",
          )
      })
    return () => controller.abort()
  }, [])
  useEffect(() => {
    localStorage.setItem("pharmacy-cart", JSON.stringify(items))
  }, [items])
  useEffect(() => {
    if (!cart) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCart(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [cart])
  const add = (product: Product) =>
    setItems((previous) =>
      previous.some((item) => item.product.id === product.id)
        ? previous.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...previous, { product, quantity: 1 }],
    )
  const change = (id: string, delta: number) =>
    setItems((previous) =>
      previous
        .map((item) =>
          item.product.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  const links = [
    ["/", "Početna"],
    ["/kategorije", "Kategorije"],
    ["/proizvodi", "Proizvodi"],
    ["/savjeti", "Savjeti"],
    ["/kontakt", "Kontakt"],
  ]
  return (
    <Store.Provider
      value={{ data, error, items, add, change, open: () => setCart(true) }}
    >
      <div className="bg-[#e7edde] py-2.5 text-center text-[11px] tracking-[0.035em]">
        Mala pažnja za vaše zdravlje.{" "}
        <span className="ml-2 font-semibold">
          Besplatna dostava iznad 60 KM.
        </span>
      </div>
      <header className="border-b border-border bg-background">
        <div
          className={`${wrap} flex h-[84px] items-center justify-between gap-6`}
        >
          <button
            className="md:hidden"
            onClick={() => setMenu(!menu)}
            aria-label="Otvori navigaciju"
            aria-expanded={menu}
          >
            <Menu size={22} />
          </button>
          <nav className="hidden h-full items-center gap-9 md:flex">
            {links.map(([href, label]) => (
              <NavLink
                end={href === "/"}
                key={href}
                to={href}
                className={({ isActive }) =>
                  `flex h-full items-center border-b-2 text-[13px] font-medium ${
                    isActive
                      ? "border-[#294f41] text-[#294f41]"
                      : "border-transparent text-[#68736b] hover:text-[#294f41]"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 lg:gap-6">
            <Link to="/proizvodi" aria-label="Pretraži proizvode">
              <Search size={20} strokeWidth={1.6} />
            </Link>
            <span className="h-6 w-px bg-border" />
            <button
              onClick={() => setCart(true)}
              className="flex items-center gap-2.5 text-xs"
            >
              <ShoppingBag size={20} strokeWidth={1.6} />
              <span>Korpa</span>
              <span className="grid size-5 place-items-center rounded-full bg-[#e9eee3] text-[10px]">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
        {menu && (
          <nav className="flex flex-wrap gap-5 border-t border-border p-6 md:hidden">
            {links.map(([href, label]) => (
              <Link key={href} to={href} onClick={() => setMenu(false)}>
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-border bg-[#f2f4ed]">
        <div
          className={`${wrap} flex flex-col justify-between gap-8 py-12 md:flex-row`}
        >
          <div>
            <p className="text-lg font-medium">Zdravlje zaslužuje pažnju.</p>
            <p className="mt-3 max-w-sm text-xs leading-6 text-[#758074]">
              Pažljivo odabrana ponuda i stručna podrška za vaše svakodnevno
              zdravlje.
            </p>
          </div>
          <div className="flex flex-wrap gap-7 text-xs">
            {links.slice(1).map(([href, label]) => (
              <Link key={href} to={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div
          className={`${wrap} flex justify-between border-t border-border py-5 text-[10px] text-[#798174]`}
        >
          <span>© 2026 Online apoteka</span>
        </div>
      </footer>
      {cart && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setCart(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Vaša korpa"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Vaša korpa</h2>
              <button
                autoFocus
                onClick={() => setCart(false)}
                aria-label="Zatvori korpu"
              >
                <X />
              </button>
            </div>
            <div className="mt-8 flex-1 overflow-auto">
              {!items.length && (
                <p className="text-sm text-[#758074]">
                  Vaša korpa je prazna. Pronađite nešto za sebe.
                </p>
              )}
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 border-b border-border py-5"
                >
                  <img
                    className="size-16 rounded object-cover"
                    src={item.product.image}
                    alt={item.product.name}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="my-2 text-xs">{money(item.product.price)}</p>
                    <div className="flex items-center gap-4">
                      <button
                        aria-label={`Smanji količinu ${item.product.name}`}
                        onClick={() => change(item.product.id, -1)}
                      >
                        <Minus size={16} />
                      </button>
                      {item.quantity}
                      <button
                        aria-label={`Povećaj količinu ${item.product.name}`}
                        onClick={() => change(item.product.id, 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between border-t border-border pt-5 font-medium">
              <span>Ukupno</span>
              <span>
                {money(
                  items.reduce(
                    (sum, item) => sum + item.quantity * item.product.price,
                    0,
                  ),
                )}
              </span>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#758074]">
              Korpa se čuva na ovom uređaju. Online naručivanje bit će dostupno
              nakon povezivanja sistema za narudžbe.
            </p>
          </section>
        </div>
      )}
    </Store.Provider>
  )
}

function Loading() {
  const { error } = useContext(Store)
  return (
    <div
      role="status"
      className={`${wrap} py-20 text-center text-sm text-[#758074]`}
    >
      {error || "Učitavamo ponudu…"}
    </div>
  )
}
function Heading({
  eyebrow,
  title,
  link,
  to,
}: {
  eyebrow: string
  title: string
  link?: string
  to?: string
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7a8770]">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-medium leading-snug md:text-[30px]">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={to!}
          className="hidden items-center gap-3 text-xs font-medium sm:flex"
        >
          {link}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}
function Categories({ full = false }: { full?: boolean }) {
  const { data } = useContext(Store)
  return (
    <div
      className={`grid grid-cols-2 gap-3 ${
        full ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-6"
      }`}
    >
      {data?.categories.map((category) => {
        const Icon = icons[category.icon] || Leaf
        return (
          <Link
            key={category.id}
            to={`/kategorije/${category.id}`}
            className="group flex items-center gap-3 rounded-lg border border-[#e2e7dc] bg-[#f6f7f1] px-4 py-5 transition hover:border-[#809575] hover:bg-[#eef2e7]"
          >
            <Icon
              size={25}
              strokeWidth={1.35}
              className="shrink-0 text-[#65805b]"
            />
            <div>
              <h3 className="text-[12px] font-medium">{category.name}</h3>
              {full && (
                <p className="mt-2 text-xs text-[#758074]">
                  {category.description}
                </p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
function ProductCard({ product }: { product: Product }) {
  const { add } = useContext(Store)
  const [added, setAdded] = useState(false)
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-white">
      <Link to={`/proizvodi/${product.id}`} className="relative block">
        <div className="h-[235px] overflow-hidden bg-[#f4f5ef]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        {product.badge && (
          <span className="absolute left-4 top-4 rounded bg-white/95 px-2.5 py-1 text-[10px] font-medium">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="p-5">
        <p className="text-[9px] uppercase tracking-[0.14em] text-[#818978]">
          {product.brand}
        </p>
        <Link
          to={`/proizvodi/${product.id}`}
          className="mt-2 block text-sm font-medium"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-[11px] text-[#93998c]">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <span className="text-base font-semibold">
              {money(product.price)}
            </span>
            {product.oldPrice && (
              <span className="ml-2 text-[10px] text-[#959b8e] line-through">
                {money(product.oldPrice)}
              </span>
            )}
          </div>
          <button
            aria-label={`Dodaj ${product.name} u korpu`}
            onClick={() => {
              add(product)
              setAdded(true)
              window.setTimeout(() => setAdded(false), 1600)
            }}
            className="grid size-9 place-items-center rounded-lg bg-[#edf1e5] text-[#42603c] transition hover:bg-[#dce6ce]"
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </article>
  )
}
function Pharmacist() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-[#dfe5d7] bg-[#eef2e6] p-8 lg:p-11">
      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#617456]">
        <MessageSquare size={15} />
        Stručna podrška
      </div>
      <h2 className="mt-6 text-[29px] font-medium">Pitajte farmaceuta.</h2>
      <p className="mt-3 max-w-sm text-[13px] leading-6 text-[#73806b]">
        Pravi savjet čini razliku. Obratite nam se za stručne informacije o
        proizvodima i njihovoj primjeni.
      </p>
      <Link to="/kontakt?tema=farmaceut" className={`${primary} mt-7`}>
        Postavite pitanje
        <ArrowUpRight size={16} />
      </Link>
      <div className="mt-7 flex items-center gap-2 border-t border-[#dce3d3] pt-5 text-[10px] text-[#7d8973]">
        <ShieldCheck size={14} />
        Diskretno, pažljivo i bez obaveze.
      </div>
    </section>
  )
}
function Home() {
  const { data } = useContext(Store)
  const [query, setQuery] = useState("")
  return (
    <>
      <section className="bg-[#eef1e7]">
        <div
          className={`${wrap} grid items-center gap-8 py-12 md:grid-cols-[1.05fr_1fr] md:py-14`}
        >
          <div className="py-4">
            <p className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#697e5b]">
              <span className="h-px w-6 bg-[#849874]" />
              Za zdraviji svaki dan
            </p>
            <h1 className="max-w-lg text-[42px] font-medium leading-[1.14] tracking-[-0.015em] lg:text-[54px]">
              Vaše zdravlje.
              <br />
              Naša <span className="text-[#788b62]">svakodnevna</span>
              <br />
              <span className="text-[#788b62]">briga.</span>
            </h1>
            <p className="mt-6 max-w-sm text-[13px] leading-6 text-[#76816f]">
              Provjereni proizvodi, stručni savjeti i pažnja koju zaslužujete.
              Za male izbore koji čine veliku razliku.
            </p>
            <form
              action="/proizvodi"
              className="mt-7 flex max-w-[405px] items-center gap-3 rounded-lg border border-[#dce2d4] bg-white p-2"
            >
              <Search size={17} className="ml-2 text-[#87917f]" />
              <input
                aria-label="Pretražite proizvode"
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Šta tražite danas?"
                className="min-w-0 flex-1 bg-transparent text-xs outline-none"
              />
              <button className="rounded-md bg-[#294f41] px-4 py-3 text-[11px] text-white">
                Pretraži
              </button>
            </form>
            <p className="mt-4 text-[10px] text-[#8b9483]">
              Njega, imunitet, vitamini i još mnogo toga.
            </p>
          </div>
          <div className="relative h-[390px] overflow-hidden rounded-t-[100px] rounded-b-xl md:h-[410px]">
            {data && (
              <img
                src={data.hero}
                alt="Prirodna njega i pažljivo odabrani preparati"
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-lg border border-white/60 bg-white/90 p-4 backdrop-blur">
              <div className="grid size-10 place-items-center rounded-full bg-[#edf1e5]">
                <Leaf size={20} strokeWidth={1.4} />
              </div>
              <div>
                <p className="text-xs font-medium">
                  Priroda i nauka. U ravnoteži.
                </p>
                <p className="mt-1 text-[10px] text-[#808977]">
                  Pažljivo odabrano za vaše potrebe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="border-b border-border">
        <div className={`${wrap} grid grid-cols-1 gap-5 py-5 sm:grid-cols-3`}>
          {[
            [
              ShieldCheck,
              "Provjeren kvalitet",
              "Originalni i pažljivo odabrani proizvodi",
            ],
            [Truck, "Pouzdana dostava", "Na vašu adresu, širom BiH"],
            [
              MessageSquare,
              "Stručan savjet",
              "Farmaceut kojem se možete obratiti",
            ],
          ].map(([Icon, title, subtitle]) => {
            const Glyph = Icon as typeof ShieldCheck
            return (
              <div
                key={String(title)}
                className="flex items-center gap-3 sm:justify-center"
              >
                <Glyph size={23} strokeWidth={1.3} className="text-[#738267]" />
                <div>
                  <p className="text-[11px] font-medium">{String(title)}</p>
                  <p className="mt-1 text-[10px] text-[#8b9285]">
                    {String(subtitle)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {!data ? (
        <Loading />
      ) : (
        <>
          <section className={`${wrap} py-12`}>
            <Heading
              eyebrow="Pronađite ono što vam treba"
              title="Njega za svaku potrebu"
              link="Sve kategorije"
              to="/kategorije"
            />
            <Categories />
          </section>
          <section className={`${wrap} pb-14 pt-1`}>
            <Heading
              eyebrow="Pažljivo odabrano"
              title="Izdvojeno za vas"
              link="Pogledajte sve proizvode"
              to="/proizvodi"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
          <section
            className={`${wrap} grid gap-6 pb-16 md:grid-cols-[1.2fr_1fr]`}
          >
            {data.advice[0] && <AdviceCard advice={data.advice[0]} />}
            <Pharmacist />
          </section>
        </>
      )}
    </>
  )
}
function AdviceCard({ advice }: { advice: Advice }) {
  return (
    <Link
      to={`/savjeti/${advice.id}`}
      className="group relative flex min-h-[350px] overflow-hidden rounded-xl"
    >
      <img
        src={advice.image}
        alt={advice.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#16392c]/95 to-[#16392c]/20" />
      <div className="relative flex max-w-[360px] flex-col justify-end p-9 text-white">
        <p className="text-[9px] uppercase tracking-[0.17em] text-[#d2dfc4]">
          Zdravstveni kutak · {advice.tag}
        </p>
        <h2 className="mt-5 text-[30px] font-medium leading-[1.2]">
          {advice.title}
        </h2>
        <p className="mt-3 text-xs leading-6 text-white/70">{advice.summary}</p>
        <span className="mt-6 flex items-center gap-3 text-xs">
          Pročitajte savjet
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  )
}
function Page({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className={`${wrap} min-h-[60vh] py-12`}>
      <Link to="/" className="text-[11px] text-[#839079]">
        Početna / {title}
      </Link>
      <h1 className="mt-5 text-4xl font-medium">{title}</h1>
      {subtitle && (
        <p className="mt-4 max-w-xl text-sm leading-6 text-[#7d8876]">
          {subtitle}
        </p>
      )}
      <div className="mt-9">{children}</div>
    </div>
  )
}
function CategoryPage() {
  const { data } = useContext(Store)
  return (
    <Page
      title="Kategorije"
      subtitle="Pronađite njegu i podršku prilagođenu svojim potrebama."
    >
      {data ? <Categories full /> : <Loading />}
    </Page>
  )
}
function ProductsPage() {
  const { data } = useContext(Store)
  const { categoryId } = useParams()
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState("default")
  if (!data) return <Loading />
  const category = data.categories.find((item) => item.id === categoryId)
  if (categoryId && !category) return <NotFound />
  const query = params.get("q") || ""
  const selected = categoryId || params.get("category") || ""
  const products = data.products
    .filter(
      (item) =>
        (!selected || item.category === selected) &&
        `${item.name} ${item.brand}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((first, second) =>
      sort === "low"
        ? first.price - second.price
        : sort === "high"
          ? second.price - first.price
          : 0,
    )
  return (
    <Page
      title={category?.name || "Proizvodi"}
      subtitle="Pažljivo odabrana ponuda za vaše zdravlje i njegu."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <input
          className="rounded-lg border border-border bg-white px-4 py-3 text-sm"
          aria-label="Pretraga proizvoda"
          placeholder="Pretražite proizvode…"
          value={query}
          onChange={(event) =>
            setParams((previous) => {
              previous.set("q", event.target.value)
              return previous
            })
          }
        />
        {!categoryId && (
          <select
            aria-label="Kategorija"
            className="rounded-lg border border-border px-3 text-sm"
            value={selected}
            onChange={(event) =>
              setParams((previous) => {
                previous.set("category", event.target.value)
                return previous
              })
            }
          >
            <option value="">Sve kategorije</option>
            {data.categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        )}
        <select
          aria-label="Sortiranje"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-lg border border-border px-3 py-3 text-sm"
        >
          <option value="default">Preporučeno</option>
          <option value="low">Cijena: niža prvo</option>
          <option value="high">Cijena: viša prvo</option>
        </select>
      </div>
      <p className="mb-5 text-xs text-[#839079]">{products.length} proizvoda</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {!products.length && (
        <p className="py-10 text-sm">Nema proizvoda za odabrane kriterije.</p>
      )}
    </Page>
  )
}
function ProductDetail() {
  const { data, add, open } = useContext(Store)
  const { id } = useParams()
  if (!data) return <Loading />
  const product = data.products.find((item) => item.id === id)
  if (!product) return <NotFound />
  return (
    <Page title={product.name}>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          className="h-[450px] w-full rounded-xl object-cover"
        />
        <div>
          <p className="text-xs uppercase tracking-widest text-[#7d8876]">
            {product.brand}
          </p>
          <p className="mt-5 text-sm leading-7">{product.description}</p>
          <p className="mt-6 text-3xl">{money(product.price)}</p>
          <button
            className={`${primary} mt-7`}
            onClick={() => {
              add(product)
              open()
            }}
          >
            <ShoppingBag size={18} />
            Dodaj u korpu
          </button>
          <p className="mt-5 text-xs text-[#7d8876]">
            Za informacije o primjeni, obratite se farmaceutu.
          </p>
        </div>
      </div>
    </Page>
  )
}
function AdvicePage() {
  const { data } = useContext(Store)
  const { id } = useParams()
  if (!data) return <Loading />
  const advice = data.advice.find((item) => item.id === id)
  if (id && !advice) return <NotFound />
  return (
    <Page
      title={advice?.title || "Savjeti"}
      subtitle={
        advice?.summary ||
        "Korisne informacije za male, zdravije svakodnevne izbore."
      }
    >
      {advice ? (
        <article className="max-w-3xl">
          <img
            className="mb-8 max-h-[430px] w-full rounded-xl object-cover"
            src={advice.image}
            alt={advice.title}
          />
          <p className="whitespace-pre-line text-sm leading-8">
            {advice.content}
          </p>
          <p className="mt-8 rounded-lg bg-[#eef2e6] p-5 text-xs leading-6">
            Sadržaj je informativan i ne zamjenjuje savjet ljekara ili
            farmaceuta.
          </p>
        </article>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {data.advice.map((item) => (
            <AdviceCard key={item.id} advice={item} />
          ))}
        </div>
      )}
    </Page>
  )
}
function Contact() {
  const { data } = useContext(Store)
  const [params] = useSearchParams()
  return (
    <Page
      title={params.get("tema") ? "Pitajte farmaceuta" : "Kontakt"}
      subtitle="Tu smo da saslušamo, pojasnimo i pomognemo vam napraviti informisan izbor."
    >
      <div className="grid gap-12 md:grid-cols-2">
        <Pharmacist />
        <div>
          <h2 className="text-xl font-medium">Obratite nam se</h2>
          {data ? (
            <div className="mt-6 space-y-5 text-sm">
              <a
                className="flex items-center gap-3"
                href={`mailto:${data.contact.email}`}
              >
                <Mail size={19} />
                {data.contact.email}
              </a>
              <a
                className="flex items-center gap-3"
                href={`tel:${data.contact.phone.replace(/\s/g, "")}`}
              >
                <Phone size={19} />
                {data.contact.phone}
              </a>
              <p className="flex items-center gap-3">
                <Clock size={19} />
                {data.contact.hours}
              </p>
              <p className="mt-8 text-xs leading-6 text-[#839079]">
                Kontakt podaci u demonstraciji su primjeri. Za hitna zdravstvena
                stanja obratite se hitnoj medicinskoj službi.
              </p>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </Page>
  )
}
function NotFound() {
  return (
    <Page title="Stranica nije pronađena">
      <Link to="/" className={primary}>
        Povratak na početnu
        <ArrowRight size={16} />
      </Link>
    </Page>
  )
}
const AdminDesign = lazy(() => import("../admin/Admin").then(module => ({ default: module.Admin })));
function AdminPreview() {
  return <AdminAccess><Suspense fallback={<div className="p-8">Učitavanje administracije…</div>}><AdminDesign /></Suspense></AdminAccess>;
}
const router = createBrowserRouter([
  { path: "admin", Component: AdminPreview },
  { path: "admin/:section", Component: AdminPreview },
  {
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "kategorije", Component: CategoryPage },
      { path: "kategorije/:categoryId", Component: ProductsPage },
      { path: "proizvodi", Component: ProductsPage },
      { path: "proizvodi/:id", Component: ProductDetail },
      { path: "savjeti", Component: AdvicePage },
      { path: "savjeti/:id", Component: AdvicePage },
      { path: "kontakt", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
])
export default function App() {
  return <RouterProvider router={router} />
}
