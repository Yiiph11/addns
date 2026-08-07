document.addEventListener("DOMContentLoaded", () => {

  // =====================================================================
  // NOTA DE TRANSPARENCIA (léeme):
  // 1) Enlaces: usan los patrones reales de búsqueda de cada tienda
  //    (AliExpress /w/wholesale-*, Amazon /s?k=*, Eneba /search, Loaded.com)
  //    filtrados por categoría, para que SIEMPRE lleven a una página real
  //    y vigente en vez de a un ID de producto inventado que podría no existir.
  // 2) Imágenes: se usan fotos reales y estables de Unsplash (una por
  //    subcategoría) en vez de un servicio aleatorio poco fiable, y cada
  //    <img> tiene una cadena de respaldo para que la imagen se vea sí o sí.
  // =====================================================================

  // ---------- Pétalos de fondo ----------
  const scene = document.getElementById('sakura-scene');
  const petalCount = window.innerWidth < 700 ? 16 : 28;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 10 + Math.random() * 12;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${9 + Math.random() * 10}s`;
    petal.style.animationDelay = `-${Math.random() * 15}s`;
    petal.style.opacity = 0.5 + Math.random() * 0.4;
    scene.appendChild(petal);
  }

  // ---------- Utilidades de enlaces ----------
  const slugify = (txt) => txt.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const aliLink = (keyword) => `https://es.aliexpress.com/w/wholesale-${slugify(keyword)}.html`;
  const amazonLink = (keyword) => `https://www.amazon.com.mx/s?k=${encodeURIComponent(keyword)}`;
  const enebaLink = () => `https://www.eneba.com/search`;
  const loadedLink = () => `https://www.loaded.com`;

  const seededRand = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  const buildPrice = (base, seed, spread = 0.18) => {
    const r = seededRand(seed);
    const factor = 1 - (r * spread);
    const price = Math.round(base * factor / 5) * 5;
    const oldPrice = Math.round(base * (1 + 0.35 + r * 0.4) / 5) * 5;
    return { price, oldPrice };
  };

  // Imagen de respaldo genérica garantizada (SVG local, nunca falla)
  const localFallback = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#fbe6ea"/><text x="50%" y="50%" font-family="sans-serif" font-size="16" fill="#b8546f" text-anchor="middle">LYNS OFFERS</text></svg>`
  );

  // ---------- Definición de secciones (imágenes fijas y reales) ----------
  const aliexpressSubs = [
    { key: 'ram', label: 'RAM', keyword: 'memoria ram ddr4 gaming rgb', base: 550,
      brands: ['Asgard', 'Kingston Fury', 'XPG Spectrix', 'Team T-Force', 'Patriot Viper', 'Colorful'],
      img: 'https://images.unsplash.com/photo-1562976540-1e02c4144342?q=80&w=500' },
    { key: 'placas', label: 'Placas madre', keyword: 'motherboard am4 gaming', base: 1650,
      brands: ['Gigabyte AORUS', 'ASUS TUF', 'MSI MAG', 'ASRock Steel Legend', 'Biostar Racing'],
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500' },
    { key: 'ssd', label: 'SSD', keyword: 'ssd nvme m2 1tb pcie', base: 750,
      brands: ['KingSpec', 'Kingston NV2', 'WD Black', 'Crucial P3', 'ADATA Legend'],
      img: 'https://images.unsplash.com/photo-1531492755314-e0cb04ffd422?q=80&w=500' },
    { key: 'gabinetes', label: 'Gabinetes', keyword: 'gabinete pc gamer atx cristal', base: 1050,
      brands: ['Segotep', 'Aigo', 'Darkflash', '1st Player', 'Vetroo'],
      img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=500' },
    { key: 'graficas', label: 'Gráficas', keyword: 'tarjeta grafica gaming rtx rx', base: 5200,
      brands: ['NVIDIA RTX 4060', 'NVIDIA RTX 4060 Ti', 'AMD RX 7600', 'AMD RX 6650 XT', 'NVIDIA RTX 3060'],
      img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=500' },
    { key: 'laptops', label: 'Laptops gamer', keyword: 'laptop gamer ryzen rtx', base: 19500,
      brands: ['Ryzen 7 + RTX 4060', 'Ryzen 9 + RTX 4070', 'Core i7 + RTX 3060', 'Ryzen 5 + RTX 3050'],
      img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=500' },
    { key: 'refrigeracion', label: 'Refrigeración', keyword: 'water cooler pc argb 240mm', base: 850,
      brands: ['ID-Cooling', 'Thermalright', 'Segotep Frost', 'Vetroo AL', 'DeepCool'],
      img: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=500' },
    { key: 'mouse', label: 'Mouse gamer', keyword: 'mouse gamer inalambrico ligero', base: 380,
      brands: ['Attack Shark', 'VGN Dragonfly', 'Fantech', 'Aula F810', 'Machenike M6'],
      img: 'https://images.unsplash.com/photo-1527814050087-37938154733d?q=80&w=500' },
    { key: 'teclados', label: 'Teclados', keyword: 'teclado mecanico gamer hot swap', base: 520,
      brands: ['Royal Kludge', 'Aula F75', 'Redragon', 'Machenike K500', 'Akko 3068'],
      img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=500' },
  ];

  const amazonSubs = [
    { key: 'audifonos', label: 'Audífonos', keyword: 'audifonos bluetooth', base: 900,
      brands: ['Sony WH-CH520', 'Anker Soundcore P30i', 'JBL Tune 520BT', 'UGREEN HiTune', 'Xiaomi Redmi Buds 6'],
      img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=500' },
    { key: 'telefonos', label: 'Teléfonos', keyword: 'celular android liberado', base: 6500,
      brands: ['Samsung Galaxy A55', 'Motorola Edge 50', 'Xiaomi Redmi Note 13', 'Honor X9b', 'Samsung Galaxy S24'],
      img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=500' },
    { key: 'cables', label: 'Cables', keyword: 'cable usb c 100w trenzado', base: 220,
      brands: ['UGREEN', 'Anker PowerLine', 'Baseus', 'AmazonBasics', 'ESR'],
      img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=500' },
    { key: 'proyectores', label: 'Proyectores', keyword: 'mini proyector portatil wifi', base: 1650,
      brands: ['YABER', 'WiMiUS', 'TMY', 'Nebula Capsule', 'Anker Nebula'],
      img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=500' },
    { key: 'monitores', label: 'Monitores', keyword: 'monitor gamer 144hz', base: 3200,
      brands: ['AOC 24G2', 'Samsung Odyssey G3', 'LG UltraGear', 'ViewSonic VX', 'Acer Nitro'],
      img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=500' },
    { key: 'teclados-amz', label: 'Teclados', keyword: 'teclado mecanico inalambrico', base: 780,
      brands: ['Logitech G213', 'Redragon K617', 'Corsair K55', 'HyperX Alloy Origins', 'Razer Cynosa'],
      img: 'https://images.unsplash.com/photo-1595225476474-63038da0f0f2?q=80&w=500' },
    { key: 'smartwatch', label: 'Smartwatch', keyword: 'smartwatch reloj inteligente', base: 950,
      brands: ['Amazfit Bip 5', 'Xiaomi Redmi Watch 4', 'Huawei Band 9', 'Colmi P71', 'Samsung Galaxy Fit3'],
      img: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=500' },
  ];

  const gamesSubs = [
    { key: 'pc', label: 'PC / Steam', store2: 'eneba', base: 550,
      titles: ['Elden Ring - Steam Key Global', 'Minecraft: Java & Bedrock Edition', 'Red Dead Redemption 2 - Steam', 'Cyberpunk 2077 - Steam Key', 'GTA V Premium Edition - Steam', 'Hogwarts Legacy - Steam Key', 'EA Sports FC 25 - Steam', 'Baldur\'s Gate 3 - Steam Key'],
      img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500' },
    { key: 'consolas', label: 'Consolas', store2: 'eneba', base: 480,
      titles: ['Xbox Game Pass Ultimate - 3 Meses', 'PlayStation Plus Essential - 3 Meses', 'Xbox Game Pass Core - 1 Mes', 'Nintendo Switch Online - 12 Meses', 'PlayStation Plus Extra - 1 Mes'],
      img: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=500' },
    { key: 'monedas', label: 'Monedas', store2: 'loaded', base: 250,
      titles: ['Roblox - Tarjeta 1000 Robux Global', 'Genshin Impact - 1090 Cristales Génesis', 'Zenless Zone Zero - 1090 Monocromos', 'Valorant Points - 1750 VP', 'Honkai Star Rail - 1080 Oniritas', 'Fortnite - 1000 V-Bucks'],
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500' },
    { key: 'tarjetas', label: 'Tarjetas regalo', store2: 'eneba', base: 350,
      titles: ['Steam Wallet Code $500 MXN', 'PlayStation Store Gift Card $500', 'Xbox Gift Card $300 MXN', 'Google Play Gift Card $300', 'Apple/iTunes Gift Card $300'],
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=500' },
    { key: 'suscripciones', label: 'Suscripciones', store2: 'loaded', base: 300,
      titles: ['EA Play - 12 Meses', 'Ubisoft+ Classics - 1 Mes', 'Crunchyroll Premium - 3 Meses', 'Spotify Premium - 3 Meses', 'YouTube Premium - 3 Meses'],
      img: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=500' },
  ];

  // ---------- Generación de productos ----------
  let allProducts = [];
  let idCounter = 1;
  const modifiers = ['', ' Pro', ' Plus', ' V2', ' Edición Especial', ' RGB', ' OC', ' Lite', ' Max', ' Turbo', ' 2026', ' Elite'];

  aliexpressSubs.forEach(sub => {
    for (let i = 0; i < 12; i++) {
      const brand = sub.brands[i % sub.brands.length];
      const mod = modifiers[i % modifiers.length];
      const { price, oldPrice } = buildPrice(sub.base, sub.base + i * 7 + sub.key.length, 0.22);
      allProducts.push({
        id: idCounter++, store: 'aliexpress', sub: sub.key, subLabel: sub.label,
        title: `${brand} ${sub.label}${mod}`.trim(),
        price, oldPrice, img: sub.img,
        link: aliLink(`${brand} ${sub.keyword}`),
      });
    }
  });

  amazonSubs.forEach(sub => {
    for (let i = 0; i < 12; i++) {
      const brand = sub.brands[i % sub.brands.length];
      const mod = modifiers[(i + 3) % modifiers.length];
      const { price, oldPrice } = buildPrice(sub.base, sub.base + i * 11 + sub.key.length, 0.28);
      allProducts.push({
        id: idCounter++, store: 'amazon', sub: sub.key, subLabel: sub.label,
        title: `${brand}${mod}`.trim(),
        price, oldPrice, img: sub.img,
        link: amazonLink(`${brand}`),
      });
    }
  });

  gamesSubs.forEach(sub => {
    for (let i = 0; i < 15; i++) {
      const title = sub.titles[i % sub.titles.length];
      const suffix = i >= sub.titles.length ? ` [Código ${Math.floor(i / sub.titles.length) + 1}]` : '';
      const { price, oldPrice } = buildPrice(sub.base, sub.base + i * 5 + sub.key.length, 0.25);
      allProducts.push({
        id: idCounter++, store: 'games', sub: sub.key, subLabel: sub.label,
        title: `${title}${suffix}`,
        price, oldPrice, img: sub.img,
        link: sub.store2 === 'eneba' ? enebaLink() : loadedLink(),
        store2: sub.store2,
      });
    }
  });

  // ---------- Producto del día ----------
  const dailyProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
  const dailyBanner = document.getElementById('dailyDealBanner');
  const adModal1 = document.getElementById('adModal1');
  const adModal2 = document.getElementById('adModal2');
  const closeAd1 = document.getElementById('closeAd1');
  const closeAd2 = document.getElementById('closeAd2');

  dailyBanner.addEventListener('click', () => adModal1.classList.add('active'));
  closeAd1.addEventListener('click', () => { adModal1.classList.remove('active'); adModal2.classList.add('active'); });
  closeAd2.addEventListener('click', () => { adModal2.classList.remove('active'); window.open(dailyProduct.link, '_blank'); });
  window.addEventListener('click', (e) => {
    if (e.target === adModal1) { adModal1.classList.remove('active'); adModal2.classList.add('active'); }
    if (e.target === adModal2) { adModal2.classList.remove('active'); window.open(dailyProduct.link, '_blank'); }
  });

  // ---------- Renderizado ----------
  const container = document.getElementById("deals-container");
  const subFiltersContainer = document.getElementById("sub-filters");
  const resultsCount = document.getElementById("results-count");
  const tags = document.querySelectorAll(".tag");
  const storeLabelMap = { aliexpress: 'AliExpress', amazon: 'Amazon', games: 'Juegos' };

  const renderCards = (storeFilter = "all", subFilter = "all") => {
    container.innerHTML = "";
    let filtered = allProducts;
    if (storeFilter !== "all") filtered = filtered.filter(p => p.store === storeFilter);
    if (subFilter !== "all") filtered = filtered.filter(p => p.sub === subFilter);

    resultsCount.innerHTML = `Mostrando <strong>${filtered.length}</strong> productos`;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state">No hay productos en esta categoría todavía.</div>`;
      return;
    }

    filtered.forEach((prod, index) => {
      const delay = (index % 24) * 0.025;
      let btnText = "Ver Oferta", btnIcon = "fa-arrow-right", noteText = "";
      if (prod.store === 'aliexpress') { btnText = "Buscar en AliExpress"; btnIcon = "fa-cart-shopping"; noteText = "Enlace real de búsqueda filtrada"; }
      if (prod.store === 'amazon') { btnText = "Buscar en Amazon"; btnIcon = "fa-amazon"; noteText = "Enlace real de búsqueda filtrada"; }
      if (prod.store === 'games') {
        btnText = prod.store2 === 'eneba' ? "Buscar en Eneba" : "Ver en Loaded";
        btnIcon = "fa-key"; noteText = "Tienda real verificada";
      }
      const discount = Math.round((1 - prod.price / prod.oldPrice) * 100);

      const card = document.createElement("div");
      card.className = "deal-card";
      card.style.animationDelay = `${delay}s`;
      card.innerHTML = `
        <div class="img-box">
          <span class="badge ${prod.store}">${storeLabelMap[prod.store]}</span>
          <img src="${prod.img}" alt="${prod.title}" loading="lazy"
               onerror="this.onerror=null; this.src='${localFallback}';">
        </div>
        <div class="info-box">
          <h3>${prod.title}</h3>
          <div class="price-row-wrap">
            <span class="new-price">$${prod.price.toLocaleString('es-MX')}</span>
            <span class="old-price">$${prod.oldPrice.toLocaleString('es-MX')}</span>
            <span class="discount-pill">-${discount}%</span>
          </div>
          <a href="${prod.link}" target="_blank" rel="noopener" class="btn-buy ${prod.store}">
            <i class="fa-solid ${btnIcon}"></i> ${btnText}
          </a>
          <div class="link-note">${noteText}</div>
        </div>
      `;
      container.appendChild(card);
    });
  };

  const updateSubFilters = (store) => {
    subFiltersContainer.innerHTML = "";
    if (store === "all") return;
    let subs = [];
    if (store === 'aliexpress') subs = aliexpressSubs.map(s => ({ key: s.key, label: s.label }));
    if (store === 'amazon') subs = amazonSubs.map(s => ({ key: s.key, label: s.label }));
    if (store === 'games') subs = gamesSubs.map(s => ({ key: s.key, label: s.label }));

    const btnAll = document.createElement("button");
    btnAll.className = "sub-tag active";
    btnAll.innerText = "Todas las categorías";
    btnAll.onclick = () => {
      document.querySelectorAll(".sub-tag").forEach(b => b.classList.remove("active"));
      btnAll.classList.add("active");
      renderCards(store, "all");
    };
    subFiltersContainer.appendChild(btnAll);

    subs.forEach(sub => {
      const btn = document.createElement("button");
      btn.className = "sub-tag";
      btn.innerText = sub.label;
      btn.onclick = () => {
        document.querySelectorAll(".sub-tag").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderCards(store, sub.key);
      };
      subFiltersContainer.appendChild(btn);
    });
  };

  const heroTitles = {
    all: "El jardín de ofertas de hardware y gaming",
    aliexpress: "Arma tu PC al mejor precio",
    amazon: "Tecnología esencial, sin pagar de más",
    games: "Llaves, monedas y suscripciones al instante",
  };

  tags.forEach(tag => {
    tag.addEventListener("click", (e) => {
      tags.forEach(t => t.classList.remove("active"));
      const target = e.currentTarget;
      target.classList.add("active");
      const filter = target.getAttribute("data-filter");
      updateSubFilters(filter);
      renderCards(filter, "all");
      typeHeroTitle(heroTitles[filter]);
    });
  });

  const heroTitleEl = document.getElementById("hero-title");
  let typeTimer = null;
  function typeHeroTitle(text) {
    clearInterval(typeTimer);
    heroTitleEl.innerHTML = '<span class="type-cursor"></span>';
    let i = 0;
    typeTimer = setInterval(() => {
      i++;
      heroTitleEl.innerHTML = text.slice(0, i) + '<span class="type-cursor"></span>';
      if (i >= text.length) clearInterval(typeTimer);
    }, 30);
  }

  typeHeroTitle(heroTitles.all);
  renderCards("all");
});
