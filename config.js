window.NANAS_CONFIG = {
  whatsappNumber: "5571982321122",
  instagramUrl: "https://www.instagram.com/nanas.food10?stkn=MTl6b2Q5bnVtMnNqdw==",

  // Fallback local: usado quando o Supabase ainda não foi configurado.
  storeLocation: {
    label: "Nana's Food",
    cep: "42809849",
    address: "",
    city: "Camaçari",
    state: "BA",
    lat: null,
    lng: null
  },

  deliveryRules: {
    enabled: true,
    maxRadiusKm: 4.5,
    defaultFee: null,
    feeByDistance: []
  },

  // Enquanto o Supabase não estiver configurado, a loja fica aberta no modo local.
  storeSettings: {
    statusMode: "forced_open",
    timezone: "America/Bahia"
  },
  storeHours: [],

  menu: [
    { id:"Refri", name:"REfri230ml", ingredients:"consulte sabores disponivéis", price:2.50, image:"assets/refri230ml.jpeg", available:true, soldOut:false },
    { id:"tradicional", name:"Hot dog simples", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha e barbecue.", price:5.00, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"tradicional-duplo", name:"Hot dog duplo", ingredients:"02 salsichas, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha e barbecue.", price:6.00, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"bolonhesa", name:"Hot dog bolonhesa", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, carne moída e barbecue.", price:6.50, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"frango", name:"Hot dog frango", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha e frango desfiado.", price:6.50, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"cheddar", name:"Hot dog cheddar", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, molho cheddar e barbecue.", price:6.50, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"requeijao", name:"Hot dog requeijão", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha e molho requeijão.", price:6.50, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"milho", name:"Hot dog milho", ingredients:"", price:6.50, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"calabresa", name:"Hot dog calabresa", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, calabresa e barbecue.", price:6.50, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"frango-requeijao", name:"Hot dog frango c/ requeijão", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, frango desfiado e requeijão.", price:8.00, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"calabresa-cheddar", name:"Hot dog calabresa c/ cheddar", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, calabresa, cheddar e barbecue.", price:8.00, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"supremo", name:"Supremo", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, carne moída, calabresa, frango, requeijão, cheddar e barbecue.", price:13.50, image:"assets/doguinho.jpg", available:true, soldOut:false }
  ],

  futureMenu: [
    { id:"mexicano", name:"Hot dog mexicano", ingredients:"01 salsicha, molho, milho, queijo ralado, pimenta calabresa, vinagrete, carne moída, cheddar e Doritos.", price:null, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"japones", name:"Hot dog Japonês", ingredients:"01 salsicha empanada, molho tarê, cream cheese, couve crispy e pimenta biquinho.", price:null, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"paulista", name:"Hot dog Paulista", ingredients:"01 salsicha, molho, milho, queijo ralado, ketchup, maionese, mostarda, batata palha, barbecue e purê de batata.", price:null, image:"assets/doguinho.jpg", available:true, soldOut:false },
    { id:"sertanejo", name:"Hot dog sertanejo", ingredients:"01 salsicha, molho, carne desfiada, banana-da-terra frita, queijo coalho, batata palha e barbecue.", price:null, image:"assets/doguinho.jpg", available:true, soldOut:false }
  ],

  condiments: [
    { id:"ketchup", name:"Ketchup", active:true },
    { id:"maionese", name:"Maionese", active:true },
    { id:"mostarda", name:"Mostarda", active:true },
    { id:"barbecue", name:"Barbecue", active:true },
    { id:"molho-verde", name:"Molho verde", active:true }
  ],

  addons: [
    { id:"cheddar", name:"Cheddar", price:1.50, active:true },
    { id:"requeijao", name:"Requeijão", price:1.50, active:true },
    { id:"calabresa", name:"Calabresa", price:1.50, active:true },
    { id:"frango", name:"Frango", price:1.50, active:true },
    { id:"bolonhesa", name:"Bolonhesa", price:1.50, active:true },
    { id:"milho", name:"Milho", price:1.00, active:true },
    { id:"salsicha", name:"Salsicha", price:1.00, active:true }
  ]
};
