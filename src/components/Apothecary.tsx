import { useState, type ReactNode, type SVGProps } from "react";

type IconName =
  | "arrow"
  | "baby"
  | "bag"
  | "beauty"
  | "chevron"
  | "heart"
  | "leaf"
  | "mail"
  | "menu"
  | "message"
  | "pill"
  | "phone"
  | "search"
  | "shield"
  | "sparkle"
  | "sun"
  | "truck"
  | "user"
  | "x";

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="m5 12 14 0m-5-5 5 5-5 5" />,
    baby: (
      <>
        <path d="M9 3c1.8 0 3 1.2 3 3-2.4 0-3-1-3-3Z" />
        <path d="M12 6a7 7 0 1 0 7 7c0-1.5-.4-2.8-1.2-4" />
        <path d="M9 12h.01M15 12h.01M9.5 16c1.5 1 3.5 1 5 0" />
      </>
    ),
    bag: (
      <>
        <path d="M5 8h14l-1 13H6L5 8Z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </>
    ),
    beauty: (
      <>
        <path d="m12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8L12 3Z" />
        <path d="m5 15 .7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15Zm14-3 .7 2.3 2.3.7-2.3.7L19 18l-.7-2.3L16 15l2.3-.7L19 12Z" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    leaf: <path d="M20 4c-8 0-14 3-14 9 0 3 2 5 5 5 6 0 9-6 9-14ZM4 21c2-5 6-8 12-11" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    pill: (
      <>
        <path d="m8.5 16.5-1 1a4 4 0 0 1-5.7-5.7l8.5-8.5A4 4 0 0 1 16 9l-1 1" />
        <path d="m6 8 5 5" />
        <rect x="10" y="10" width="12" height="7" rx="3.5" transform="rotate(-45 16 13.5)" />
      </>
    ),
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4" />,
    sparkle: (
      <>
        <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" />
        <path d="m19 17 .6 2.4L22 20l-2.4.6L19 23l-.6-2.4L16 20l2.4-.6L19 17Z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export const categories: { name: string; icon: IconName; description: string }[] = [
  { name: "Lijekovi", icon: "pill", description: "Bez recepta" },
  { name: "Imunitet", icon: "shield", description: "Vitamini i minerali" },
  { name: "Njega i ljepota", icon: "beauty", description: "Koža, kosa i tijelo" },
  { name: "Mama i beba", icon: "baby", description: "Nježna svakodnevica" },
  { name: "Prirodno zdravlje", icon: "leaf", description: "Biljni preparati" },
  { name: "Sunce i zaštita", icon: "sun", description: "Sigurna zaštita" },
];

export type Product = {
  name: string;
  brand: string;
  category: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
};

export const products: Product[] = [
  {
    name: "Magnezij Direkt",
    brand: "Biolectra",
    category: "Imunitet",
    price: "18,90 KM",
    oldPrice: "22,50 KM",
    image:
      "https://images.unsplash.com/photo-1599682637135-92793191ae30?auto=format&fit=crop&w=700&q=85",
    badge: "-16%",
  },
  {
    name: "Vitamin D3 sprej",
    brand: "BetterYou",
    category: "Imunitet",
    price: "24,90 KM",
    image:
      "https://images.unsplash.com/photo-1608571702600-5a5419d31475?auto=format&fit=crop&w=700&q=85",
    badge: "Popularno",
  },
  {
    name: "Hidratantni serum",
    brand: "Olival",
    category: "Njega i ljepota",
    price: "21,50 KM",
    oldPrice: "27,90 KM",
    image:
      "https://images.unsplash.com/photo-1731763941642-5be9b905d36a?auto=format&fit=crop&w=700&q=85",
    badge: "-23%",
  },
  {
    name: "Biljne kapi Ehinacea",
    brand: "Herbalia",
    category: "Prirodno zdravlje",
    price: "14,90 KM",
    image:
      "https://images.unsplash.com/photo-1671493234884-b1611bcf3e69?auto=format&fit=crop&w=700&q=85",
    badge: "Novo",
  },
];

export function Header({ cartCount }: { cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    ["Početna", "#"],
    ["Kategorije", "#kategorije"],
    ["Proizvodi", "#proizvodi"],
    ["Savjeti", "#savjeti"],
    ["Kontakt", "#kontakt"],
  ];

  return (
    <>
      <div className="bg-[#d7efbd] px-5 py-2 text-center text-[11px] font-semibold tracking-wide text-[#183b56]">
        Besplatna dostava za narudžbe iznad 60 KM
      </div>
      <header className="relative z-50 border-b border-[#e0ead7] bg-[#fdfffc]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <a className="font-display text-2xl tracking-tight text-[#183b56]" href="#">
            Herba<span className="text-[#54833e]">.</span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map(([label, href]) => (
              <a
                className="text-sm font-semibold text-[#5f7485] transition hover:text-[#183b56]"
                href={href}
                key={label}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button
              aria-label="Korisnički profil"
              className="grid size-10 place-items-center rounded-full text-[#183b56] transition hover:bg-[#eef6e5]"
            >
              <Icon name="user" className="size-5" />
            </button>
            <button
              aria-label={`Korpa, ${cartCount} proizvoda`}
              className="relative grid size-10 place-items-center rounded-full text-[#183b56] transition hover:bg-[#eef6e5]"
            >
              <Icon name="bag" className="size-5" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-[#c96f4a] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              aria-expanded={menuOpen}
              aria-label="Otvori navigaciju"
              className="ml-1 grid size-10 place-items-center rounded-full text-[#183b56] lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? "x" : "menu"} className="size-5" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="absolute left-0 top-full flex w-full flex-col border-b border-[#e0ead7] bg-[#fdfffc] px-5 py-4 shadow-lg lg:hidden">
            {navItems.map(([label, href]) => (
              <a
                className="border-b border-[#e8eff2] py-3 text-sm font-semibold"
                href={href}
                key={label}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export function CategoryCard({
  active,
  category,
  onClick,
}: {
  active: boolean;
  category: (typeof categories)[number];
  onClick: () => void;
}) {
  return (
    <button
      className={`group min-h-48 rounded-3xl border p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(33,73,57,0.1)] ${
        active
          ? "border-[#376b38] bg-[#376b38] text-white"
          : "border-[#dce8ec] bg-white text-[#183b56]"
      }`}
      onClick={onClick}
      type="button"
    >
      <span
        className={`grid size-12 place-items-center rounded-2xl ${
          active
            ? "bg-white/10 text-white"
            : "bg-[#eaf5f8] text-[#54833e]"
        }`}
      >
        <Icon className="size-6" name={category.icon} />
      </span>
      <strong className="mt-8 block text-sm leading-5">{category.name}</strong>
      <span
        className={`mt-1 block text-xs ${
          active ? "text-white/65" : "text-[#7b8f9e]"
        }`}
      >
        {category.description}
      </span>
    </button>
  );
}

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  const [added, setAdded] = useState(false);
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#dce8ec] bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(33,73,57,0.11)]">
      <div className="relative aspect-[4/4.4] overflow-hidden rounded-[1.3rem] bg-[#eff5f7]">
        <img
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={product.image}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-[#376b38] shadow-sm backdrop-blur">
          {product.badge}
        </span>
        <button
          aria-label={`Dodaj ${product.name} u favorite`}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-[#5f7485] shadow-sm transition hover:text-[#c96f4a]"
        >
          <Icon name="heart" className="size-4" />
        </button>
      </div>
      <div className="px-2 pb-2 pt-5">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7890a0]">
          {product.brand}
        </span>
        <h3 className="mt-1 min-h-12 text-base font-bold leading-6">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <strong className="text-lg">{product.price}</strong>
          {product.oldPrice && (
            <del className="text-xs text-[#94a7b3]">{product.oldPrice}</del>
          )}
        </div>
        <button
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${
            added
              ? "bg-[#e7f4db] text-[#376b38]"
              : "bg-[#183b56] text-white hover:bg-[#376b38]"
          }`}
          onClick={() => {
            onAdd();
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1400);
          }}
          type="button"
        >
          <Icon name={added ? "shield" : "bag"} className="size-4" />
          {added ? "Dodano u korpu" : "Dodaj u korpu"}
        </button>
      </div>
    </article>
  );
}

export function AdviceCard() {
  return (
    <article
      className="group relative min-h-[480px] overflow-hidden rounded-[2rem]"
      id="savjeti"
    >
      <img
        alt="Biljne kapi i prirodni preparati"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        src="https://images.unsplash.com/photo-1565033624234-3fcd6717568a?auto=format&fit=crop&w=1400&q=88"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#102f4a]/95 via-[#183b56]/75 to-transparent" />
      <div className="relative flex h-full max-w-md flex-col justify-end p-8 text-white sm:p-12">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#d7efbd]">
          Zdravstveni kutak
        </span>
        <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
          Sezonski imunitet, prirodno.
        </h2>
        <p className="mt-4 text-sm leading-6 text-white/75">
          Kako pripremiti organizam i koje navike zaista mogu pomoći u
          hladnijim danima.
        </p>
        <a
          className="mt-7 flex items-center gap-2 text-sm font-bold text-[#d7efbd]"
          href="#"
        >
          Pročitajte savjet
          <Icon name="arrow" className="size-4" />
        </a>
      </div>
    </article>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#102f4a] text-white" id="kontakt">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.25fr_0.7fr_0.8fr_1fr] md:px-8">
        <div>
          <a className="font-display text-3xl" href="#">
            Herba<span className="text-[#c7e6a8]">.</span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
            Vaša savremena online apoteka. Stručno, pouzdano i uvijek s pažnjom
            prema vašem zdravlju.
          </p>
        </div>
        <FooterColumn
          links={["O nama", "Dostava i plaćanje", "Česta pitanja", "Blog"]}
          title="Herba"
        />
        <FooterColumn
          links={["Lijekovi", "Imunitet", "Njega i ljepota", "Mama i beba"]}
          title="Kategorije"
        />
        <div>
          <h3 className="text-sm font-bold">Tu smo za vas</h3>
          <div className="mt-5 space-y-4 text-sm text-white/65">
            <a className="flex items-center gap-3 hover:text-white" href="tel:+38733123456">
              <Icon name="phone" className="size-4" />
              +387 33 123 456
            </a>
            <a className="flex items-center gap-3 hover:text-white" href="mailto:zdravo@herba.ba">
              <Icon name="mail" className="size-4" />
              zdravo@herba.ba
            </a>
            <span className="flex items-center gap-3">
              <Icon name="message" className="size-4" />
              Pon–Sub, 08:00–20:00
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-5 py-6 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <span>© 2026 Herba.ba. Sva prava zadržana.</span>
        <a className="font-semibold text-white underline underline-offset-4 hover:text-[#d7efbd]" href={`${import.meta.env.BASE_URL}herba-export.tar.gz`} download="herba-export.tar.gz">
          Preuzmi projekt · export
        </a>
        <span>Privatnost · Uslovi korištenja</span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a className="text-sm text-white/60 transition hover:text-white" href="#">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
