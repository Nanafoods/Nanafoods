(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const enabled = Boolean(cfg.url && cfg.publishableKey && window.supabase?.createClient);
  const client = enabled ? window.supabase.createClient(cfg.url, cfg.publishableKey) : null;

  function numOrNull(v) {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  async function loadPublicData() {
    if (!client) return null;

    const [productsRes, addonsRes, condimentsRes, settingsRes, hoursRes, tiersRes] = await Promise.all([
      client.from("products").select("*").order("sort_order", { ascending: true }),
      client.from("addons").select("*").order("sort_order", { ascending: true }),
      client.from("condiments").select("*").order("sort_order", { ascending: true }),
      client.from("store_settings").select("*").eq("id", 1).maybeSingle(),
      client.from("store_hours").select("*").order("day_of_week", { ascending: true }),
      client.from("delivery_fee_tiers").select("*").eq("is_active", true).order("up_to_km", { ascending: true })
    ]);

    const errors = [productsRes, addonsRes, condimentsRes, settingsRes, hoursRes, tiersRes]
      .map(r => r.error).filter(Boolean);
    if (errors.length) throw errors[0];

    const products = productsRes.data || [];
    const current = products.filter(p => !p.is_future && p.is_active).map(p => ({
      id: p.id,
      name: p.name,
      ingredients: p.description || "",
      price: numOrNull(p.price),
      image: p.image_path || "assets/doguinho.jpg",
      available: Boolean(p.is_active),
      soldOut: Boolean(p.is_sold_out)
    }));
    const future = products.filter(p => p.is_future && p.is_active).map(p => ({
      id: p.id,
      name: p.name,
      ingredients: p.description || "",
      price: numOrNull(p.price),
      image: p.image_path || "assets/doguinho.jpg",
      available: Boolean(p.is_active),
      soldOut: Boolean(p.is_sold_out)
    }));

    const settings = settingsRes.data || null;
    return {
      menu: current,
      futureMenu: future,
      addons: (addonsRes.data || []).filter(a => a.is_active).map(a => ({
        id: a.id, name: a.name, price: numOrNull(a.price), active: true
      })),
      condiments: (condimentsRes.data || []).filter(c => c.is_active).map(c => ({
        id: c.id, name: c.name, active: true
      })),
      storeSettings: settings ? {
        statusMode: settings.status_mode,
        timezone: settings.timezone || "America/Bahia"
      } : null,
      storeHours: hoursRes.data || [],
      storeLocation: settings ? {
        label: "Nana's Food",
        cep: settings.store_cep || "",
        address: settings.store_address || "",
        city: settings.store_city || "Camaçari",
        state: settings.store_state || "BA",
        lat: numOrNull(settings.store_lat),
        lng: numOrNull(settings.store_lng)
      } : null,
      deliveryRules: settings ? {
        enabled: true,
        maxRadiusKm: numOrNull(settings.max_radius_km) ?? 4.5,
        defaultFee: numOrNull(settings.default_delivery_fee),
        feeByDistance: (tiersRes.data || []).map(t => ({ upToKm: Number(t.up_to_km), fee: Number(t.fee) }))
      } : null
    };
  }

  function subscribePublicChanges(callback) {
    if (!client) return () => {};
    const channel = client.channel("nanas-public-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "addons" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "condiments" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "store_settings" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "store_hours" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "delivery_fee_tiers" }, callback)
      .subscribe();
    return () => client.removeChannel(channel);
  }

  window.NanasData = { enabled, client, loadPublicData, subscribePublicChanges };
})();
