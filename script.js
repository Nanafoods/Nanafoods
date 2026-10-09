const fallback = window.NANAS_CONFIG;
let config = JSON.parse(JSON.stringify(fallback));
const state = { cart: JSON.parse(localStorage.getItem("nanas_cart") || "[]"), selectedProductId:null, storeOpen:true, storeStatusText:"Loja aberta", loadingRemote:false };
const $=(s,sc=document)=>sc.querySelector(s); const $$=(s,sc=document)=>[...sc.querySelectorAll(s)];
function money(v){return typeof v==="number"&&Number.isFinite(v)?v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"A confirmar"}
function whatsappUrl(m){return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(m)}`}
function saveCart(){localStorage.setItem("nanas_cart",JSON.stringify(state.cart));updateCartCounters();renderCart()}
function updateCartCounters(){const c=state.cart.reduce((t,i)=>t+i.qty,0);$("#cartCount").textContent=c;$("#floatingCartCount").textContent=c}
function timeToMinutes(v){if(!v)return null;const [h,m]=String(v).slice(0,5).split(":").map(Number);return h*60+m}
function zonedNow(timeZone){const parts=new Intl.DateTimeFormat("en-US",{timeZone,weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());const get=t=>parts.find(p=>p.type===t)?.value;const days={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};return{day:days[get("weekday")],minutes:Number(get("hour"))%24*60+Number(get("minute"))}}
function computeStoreStatus(){const s=config.storeSettings||{};if(s.statusMode==="forced_open")return{open:true,text:"Loja aberta"};if(s.statusMode==="forced_closed")return{open:false,text:"Loja fechada pelo administrador"};const hours=config.storeHours||[];if(!hours.length)return{open:false,text:"Horário ainda não configurado"};const now=zonedNow(s.timezone||"America/Bahia");const today=hours.find(h=>Number(h.day_of_week)===now.day);if(today?.is_open){const o=timeToMinutes(today.open_time),c=timeToMinutes(today.close_time);if(o!==null&&c!==null){if(o<c&&now.minutes>=o&&now.minutes<c)return{open:true,text:`Loja aberta até ${String(today.close_time).slice(0,5)}`};if(o>=c&&now.minutes>=o)return{open:true,text:`Loja aberta até ${String(today.close_time).slice(0,5)}`}}}const prev=hours.find(h=>Number(h.day_of_week)===(now.day+6)%7);if(prev?.is_open){const o=timeToMinutes(prev.open_time),c=timeToMinutes(prev.close_time);if(o!==null&&c!==null&&o>=c&&now.minutes<c)return{open:true,text:`Loja aberta até ${String(prev.close_time).slice(0,5)}`}}return{open:false,text:"Loja fechada no momento"}}
function applyStoreStatus(){const st=computeStoreStatus();state.storeOpen=st.open;state.storeStatusText=st.text;const pill=$("#storePill");pill.textContent=st.open?`🟢 ${st.text}`:`🔴 ${st.text}`;pill.className=`store-pill ${st.open?"open":"closed"}`;const banner=$("#storeBanner");banner.hidden=st.open;banner.textContent=st.open?"":`${st.text}. O cardápio continua disponível para consulta, mas novos pedidos estão bloqueados.`;$$('.customize-item').forEach(b=>{const sold=b.dataset.soldout==="1";b.disabled=!st.open||sold});updateCheckoutState()}
function renderMenu(){const items=config.menu.filter(i=>i.available!==false);$("#menuGrid").innerHTML=items.map((i,x)=>`<article class="food-card"><div class="food-image"><img src="${i.image||'assets/doguinho.jpg'}" alt="${i.name}">${i.id==='tradicional'?'<span class="badge">Clássico</span>':''}${i.soldOut?'<span class="badge soldout">ESGOTADO</span>':''}</div><div class="food-info"><h3>${i.name}</h3><p>${i.ingredients||''}</p><div class="card-footer"><strong class="card-price">${money(i.price)}</strong><button class="btn ${i.soldOut?'btn-disabled':'btn-primary'} customize-item" data-id="${i.id}" data-soldout="${i.soldOut?'1':'0'}" ${i.soldOut?'disabled':''}>${i.soldOut?'Esgotado':'Montar pedido'}</button></div></div></article>`).join("");const future=(config.futureMenu||[]).filter(i=>i.available!==false);$("#futureHeading").hidden=!future.length;$("#futureGrid").innerHTML=future.map(i=>`<article class="food-card"><div class="food-image"><img src="${i.image||'assets/doguinho.jpg'}" alt="${i.name}"><span class="badge soon">EM BREVE</span></div><div class="food-info"><h3>${i.name}</h3><p>${i.ingredients||''}</p><div class="card-footer"><span class="card-price">${money(i.price)}</span><button class="btn btn-disabled" disabled>Em breve</button></div></div></article>`).join("");$$('.customize-item').forEach(b=>b.addEventListener('click',()=>openItemModal(b.dataset.id)));applyStoreStatus()}
function renderCondiments(){$("#condimentsGrid").innerHTML=(config.condiments||[]).filter(c=>c.active!==false).map(c=>`<label class="condiment-option"><input type="checkbox" value="${c.id}"><span><b>${c.name}</b></span></label>`).join("")}
function renderAddons(){$("#addonsGrid").innerHTML=(config.addons||[]).filter(a=>a.active!==false).map(a=>`<label class="addon-option"><input type="checkbox" value="${a.id}"><span><b>${a.name}</b><small>${money(a.price)}</small></span></label>`).join("")}
function openModal(id){$("#"+id).classList.add('open');document.body.classList.add('modal-open')}
function closeModal(id){$("#"+id).classList.remove('open');if(!$('.modal.open'))document.body.classList.remove('modal-open')}
function openItemModal(id){
  if(!state.storeOpen)return alert('A loja está fechada no momento.');
  const p=config.menu.find(x=>x.id===id);
  if(!p||p.soldOut)return;
  state.selectedProductId=id;
  $("#itemModalTitle").textContent=p.name;
  $("#itemModalIngredients").textContent=p.ingredients||'';
  $("#itemPrice").textContent=money(p.price);
  $("#itemNote").value='';
  $$('#condimentsGrid input,#addonsGrid input').forEach(i=>i.checked=false);
  openModal('itemModal');
}
function addSelectedItemToCart(){
  if(!state.storeOpen)return;

  const p=config.menu.find(x=>x.id===state.selectedProductId);
  if(!p)return;

  const condiments=$$('#condimentsGrid input:checked')
    .map(i=>config.condiments.find(c=>c.id===i.value))
    .filter(Boolean)
    .map(c=>({id:c.id,name:c.name}));

  const addons=$$('#addonsGrid input:checked')
    .map(i=>config.addons.find(a=>a.id===i.value))
    .filter(Boolean)
    .map(a=>({id:a.id,name:a.name,price:a.price}));

  state.cart.push({
    uid:(typeof crypto!=="undefined"&&crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    productId:p.id,
    name:p.name,
    price:p.price,
    qty:1,
    condiments,
    addons,
    note:$("#itemNote").value.trim()
  });

  saveCart();
  closeModal('itemModal');
  openModal('cartModal');
}
function lineTotal(i){i.addons=i.addons||[];if(typeof i.price!=="number")return null;if(i.addons.some(a=>typeof a.price!=="number"))return null;return(i.price+i.addons.reduce((s,a)=>s+a.price,0))*i.qty}
function cartSubtotal(){if(!state.cart.length)return 0;const t=state.cart.map(lineTotal);return t.some(v=>v===null)?null:t.reduce((a,b)=>a+b,0)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function renderCart(){const el=$("#cartItems"),empty=$("#cartEmpty");if(!state.cart.length){el.innerHTML='';empty.style.display='block'}else{empty.style.display='none';el.innerHTML=state.cart.map(i=>`<article class="cart-item"><div class="cart-item-main"><div><h4>${i.qty}× ${i.name}</h4><p><b>Condimentos:</b> ${(i.condiments||[]).length?(i.condiments||[]).map(c=>c.name).join(', '):'nenhum'}</p>${(i.addons||[]).length?`<p><b>Adicionais:</b> ${i.addons.map(a=>a.name).join(', ')}</p>`:''}${i.note?`<p><b>Observação:</b> ${escapeHtml(i.note)}</p>`:''}</div><strong>${money(lineTotal(i))}</strong></div><button class="remove-item" data-uid="${i.uid}">Remover</button></article>`).join('');$$('.remove-item',el).forEach(b=>b.addEventListener('click',()=>{state.cart=state.cart.filter(i=>i.uid!==b.dataset.uid);saveCart()}))}renderOrderSummary();updateCheckoutState()}
function getDeliveryForm(){return{customerName:$("#customerName").value.trim(),customerPhone:$("#customerPhone").value.trim(),deliveryCity:$("#deliveryCity").value.trim(),deliveryStreet:$("#deliveryStreet").value.trim(),deliveryNumber:$("#deliveryNumber").value.trim(),deliveryComplement:$("#deliveryComplement").value.trim(),deliveryNeighborhood:$("#deliveryNeighborhood").value.trim(),deliveryReference:$("#deliveryReference").value.trim()}}
function saveProfile(){localStorage.setItem('nanas_delivery_profile',JSON.stringify(getDeliveryForm()))}function loadProfile(){const p=JSON.parse(localStorage.getItem('nanas_delivery_profile')||'null');if(p)Object.entries(p).forEach(([k,v])=>{const e=document.getElementById(k);if(e)e.value=v||''})}
function renderOrderSummary(){const e=$("#orderSummary"),sub=cartSubtotal();if(!state.cart.length)return e.innerHTML='';e.innerHTML=`<div><span>Subtotal dos itens</span><strong>${money(sub)}</strong></div><div><span>Entrega</span><strong>A confirmar</strong></div><div class="grand-total"><span>Total final</span><strong>A confirmar</strong></div>`}
function requiredFields(){const f=getDeliveryForm();return Boolean(f.customerName&&f.customerPhone&&f.deliveryStreet&&f.deliveryNumber&&f.deliveryNeighborhood&&f.deliveryCity)}
function updateCheckoutState(){const b=$("#finishOrder"),h=$("#checkoutHelp");const ok=state.storeOpen&&state.cart.length>0&&requiredFields();b.disabled=!ok;if(!state.storeOpen)h.textContent='A loja está fechada. O pedido não pode ser finalizado agora.';else if(!state.cart.length)h.textContent='Adicione pelo menos um item.';else if(!requiredFields())h.textContent='Preencha nome, telefone, cidade, rua, número e bairro.';else h.textContent='Tudo certo. Envie o pedido e o atendimento confirmará a entrega e a taxa.'}
function buildMessage(){const f=getDeliveryForm(),sub=cartSubtotal();const lines=state.cart.map((i,n)=>{const c=(i.condiments||[]).length?(i.condiments||[]).map(x=>x.name).join(', '):'nenhum',a=(i.addons||[]).length?`\n   Adicionais: ${i.addons.map(x=>x.name).join(', ')}`:'',o=i.note?`\n   Observação: ${i.note}`:'';return `${n+1}. ${i.qty}x ${i.name} — ${money(lineTotal(i))}\n   Condimentos: ${c}${a}${o}`}).join('\n\n');return [`Olá! Quero fazer este pedido na Nana's Food:`,``,lines,``,`ENTREGA`,`Cliente: ${f.customerName}`,`Telefone: ${f.customerPhone}`,`Endereço: ${f.deliveryStreet}, ${f.deliveryNumber}${f.deliveryComplement?' - '+f.deliveryComplement:''}`,`Bairro: ${f.deliveryNeighborhood}`,`Cidade: ${f.deliveryCity}`,f.deliveryReference?`Referência: ${f.deliveryReference}`:'',`Subtotal dos itens: ${money(sub)}`,`Disponibilidade de entrega: A confirmar pelo atendimento`,`Taxa de entrega: A confirmar`,`Total final: A confirmar após a taxa de entrega`].filter(Boolean).join('\n')}
function finishOrder(){if($("#finishOrder").disabled)return;saveProfile();window.open(whatsappUrl(buildMessage()),'_blank')}
async function loadRemote(){if(!window.NanasData?.enabled)return;try{const d=await window.NanasData.loadPublicData();if(!d)return;if(d.menu?.length)config.menu=d.menu;if(d.futureMenu)config.futureMenu=d.futureMenu;if(d.addons)config.addons=d.addons;if(d.condiments)config.condiments=d.condiments;if(d.storeSettings)config.storeSettings=d.storeSettings;if(d.storeHours)config.storeHours=d.storeHours;if(d.storeLocation)config.storeLocation={...config.storeLocation,...d.storeLocation};if(d.deliveryRules)config.deliveryRules={...config.deliveryRules,...d.deliveryRules};renderMenu();renderCondiments();renderAddons()}catch(e){console.error('Supabase:',e)}}
function initEvents(){$('.menu-toggle').addEventListener('click',()=>$('.nav').classList.toggle('open'));$$('.nav a').forEach(a=>a.addEventListener('click',()=>$('.nav').classList.remove('open')));['openCart','openCartInline','openCartBanner','openCartContact','floatingCart'].forEach(id=>$('#'+id).addEventListener('click',()=>openModal('cartModal')));$$('[data-close-modal]').forEach(e=>e.addEventListener('click',()=>closeModal(e.dataset.closeModal)));$('#addToCart').addEventListener('click',addSelectedItemToCart);
$('#continueShopping').addEventListener('click',()=>{
  closeModal('cartModal');
  document.querySelector('#cardapio').scrollIntoView({behavior:'smooth'});
});$('#finishOrder').addEventListener('click',finishOrder);$('#clearCart').addEventListener('click',()=>{state.cart=[];saveCart()});['customerName','customerPhone','deliveryCity','deliveryStreet','deliveryNumber','deliveryComplement','deliveryNeighborhood','deliveryReference'].forEach(id=>$('#'+id).addEventListener('input',()=>{saveProfile();updateCheckoutState()}));document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal.open').forEach(m=>closeModal(m.id))})}
async function init(){$$('.instagram-link').forEach(a=>a.href=config.instagramUrl);loadProfile();initEvents();updateCartCounters();renderMenu();renderCondiments();renderAddons();renderCart();await loadRemote();if(window.NanasData?.enabled){window.NanasData.subscribePublicChanges(()=>loadRemote());setInterval(loadRemote,30000)}setInterval(applyStoreStatus,30000)}init();