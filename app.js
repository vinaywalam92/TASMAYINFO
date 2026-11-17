const products=[
 {id:'p1',name:'ProBook 14',category:'Computers',kind:'laptop',price:78990,badge:'STAFF PICK',tagline:'Work without limits.',description:'A lightweight everyday laptop concept for focused work, creative projects and life on the move.',specs:['14-inch vivid display','All-day battery concept','Fast solid-state storage','Sample catalogue item']},
 {id:'p2',name:'Edge Mini Workstation',category:'Computers',kind:'mini',price:54990,badge:'COMPACT POWER',tagline:'Small footprint. Big ambition.',description:'A compact desktop concept made for flexible workspaces and everyday productivity.',specs:['Compact desktop form','Modern multi-core platform','Quiet workspace design','Sample catalogue item']},
 {id:'p3',name:'Mesh Wi-Fi 7 Router',category:'Networking',kind:'router',price:16990,badge:'STAY CONNECTED',tagline:'A stronger signal, room to room.',description:'A mesh networking concept designed to bring reliable, high-speed coverage around your home or office.',specs:['Next-generation wireless concept','Multi-room mesh coverage','Simple setup experience','Sample catalogue item']},
 {id:'p4',name:'Studio Display 27',category:'Displays',kind:'monitor',price:29990,badge:'CREATOR READY',tagline:'See the bigger picture.',description:'A crisp, spacious display concept for detailed work, presentations and your everyday setup.',specs:['27-inch display concept','Slim, adjustable stand','Wide colour experience','Sample catalogue item']},
 {id:'p5',name:'Tactile Mechanical Keyboard',category:'Accessories',kind:'keyboard',price:7490,badge:'DESK ESSENTIAL',tagline:'A better feel for every keystroke.',description:'A considered mechanical keyboard concept with a satisfying feel and a clean, compact desk footprint.',specs:['Tactile mechanical keys','Compact layout concept','USB-C connection','Sample catalogue item']},
 {id:'p6',name:'Universal USB-C Dock',category:'Accessories',kind:'hub',price:5990,badge:'CONNECT MORE',tagline:'One hub. More possibilities.',description:'A small everyday hub concept for expanding your laptop setup with useful connections.',specs:['Multi-port USB-C design','Display and data connections','Compact aluminium finish','Sample catalogue item']}
];
const rupees=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const visual=k=>k==='laptop'?'<div class="visual-object visual-laptop"><div class="v-screen"></div><div class="v-base"></div><div class="v-shadow"></div></div>':'<div class="visual-object visual-'+k+'"></div>';
let activeCategory='All',searchTerm='',sortMode='featured',toastTimer,cart=[];
try{cart=JSON.parse(localStorage.getItem('tasmay-demo-cart')||'[]')}catch{}
function saveCart(){localStorage.setItem('tasmay-demo-cart',JSON.stringify(cart))}
function showToast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2500)}
function renderProducts(){
 let list=products.filter(p=>(activeCategory==='All'||p.category===activeCategory)&&(p.name+' '+p.category+' '+p.tagline).toLowerCase().includes(searchTerm));
 if(sortMode==='price-low')list.sort((a,b)=>a.price-b.price);if(sortMode==='price-high')list.sort((a,b)=>b.price-a.price);if(sortMode==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
 $('#resultsCount').textContent=list.length+' sample '+(list.length===1?'product':'products');
 $('#productGrid').innerHTML=list.map(p=>'<article class="product-card" data-product="'+p.id+'" tabindex="0" aria-label="View '+p.name+'"><div class="product-visual"><span class="product-badge">'+p.badge+'</span><button class="product-favorite" aria-label="Save '+p.name+'" data-favorite="'+p.id+'">♡</button>'+visual(p.kind)+'</div><div class="product-info"><div class="product-kicker"><span>'+p.category+'</span><span>DEMO ITEM</span></div><h3 class="product-name">'+p.name+'</h3><p class="product-description">'+p.tagline+'</p><div class="product-purchase"><div class="product-price">'+rupees(p.price)+'<small>Illustrative price</small></div><button class="product-buy" data-add="'+p.id+'">Add to bag +</button></div></div></article>').join('');
 $('#emptyState').hidden=list.length>0;$('#productGrid').hidden=list.length===0;registerDepthCards();
}
let depthObserver;
function registerDepthCards(){
 const cards=$$('.product-card,.category-tile');
 if(!depthObserver&&'IntersectionObserver'in window)depthObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('depth-visible');depthObserver.unobserve(e.target)}}),{threshold:.1});
 cards.forEach((el,i)=>{if(el.dataset.depthReady)return;el.dataset.depthReady='1';el.classList.add('depth-card');el.style.setProperty('--depth-index',i%5);if(depthObserver)depthObserver.observe(el);else el.classList.add('depth-visible')});
 updateScrollDepth();
}
let depthTick=false;
function updateScrollDepth(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const vh=innerHeight||800;
 $$('.depth-card').forEach(el=>{const r=el.getBoundingClientRect(),p=Math.max(-1,Math.min(1,(r.top+r.height*.5-vh*.5)/(vh*.8)));const side=(el.classList.contains('category-tile')?(Number(el.style.getPropertyValue('--depth-index'))-2)*.55:(Number(el.style.getPropertyValue('--depth-index'))%3-1));el.style.setProperty('--depth-y',(p*8).toFixed(1)+'px');el.style.setProperty('--depth-x',(p*4.5).toFixed(1)+'deg');el.style.setProperty('--depth-yaw',(side*Math.abs(p)*3.2).toFixed(1)+'deg')});
 const hero=$('.hero'),art=$('.hero-art'),featured=$('.featured'),fa=$('.featured-art');
 if(hero&&art){const r=hero.getBoundingClientRect(),p=Math.max(-1,Math.min(1,(r.top+r.height*.5-vh*.5)/(vh*.8)));art.style.setProperty('--hero-depth',(p*-20).toFixed(1)+'px');art.style.setProperty('--hero-turn',(p*1.6).toFixed(1)+'deg')}
 if(featured&&fa){const r=featured.getBoundingClientRect(),p=Math.max(-1,Math.min(1,(r.top+r.height*.5-vh*.5)/(vh*.8)));fa.style.setProperty('--feature-depth',(p*-14).toFixed(1)+'px');fa.style.setProperty('--feature-turn',(p*2.5).toFixed(1)+'deg')}
 depthTick=false;
}
function onScrollDepth(){if(!depthTick){requestAnimationFrame(updateScrollDepth);depthTick=true}}
function setCategory(c){activeCategory=c;$$('.filter-chip').forEach(b=>b.classList.toggle('selected',b.dataset.category===c));$$('.category-tile').forEach(b=>b.classList.toggle('active',b.dataset.category===c));renderProducts()}
function getProduct(id){return products.find(p=>p.id===id)}
function addToCart(id){const i=cart.find(x=>x.id===id);if(i)i.quantity++;else cart.push({id:id,quantity:1});saveCart();renderCart();showToast(getProduct(id).name+' added to your bag')}
function renderCart(){
 const qty=cart.reduce((n,i)=>n+i.quantity,0),sum=cart.reduce((n,i)=>n+(getProduct(i.id)?.price||0)*i.quantity,0);
 $$('.cart-count').forEach(x=>x.textContent=qty);$('.cart-count-inline').textContent='('+qty+')';$('#cartSubtotal').textContent=rupees(sum);
 const empty=cart.length===0;$('#cartEmpty').classList.toggle('show',empty);$('#cartBottom').classList.toggle('hidden',empty);
 $('#cartItems').innerHTML=cart.map(i=>{const p=getProduct(i.id);return p?'<div class="cart-row"><div class="cart-thumb">'+visual(p.kind)+'</div><div><h3>'+p.name+'</h3><small>'+p.category+' · Sample item</small><span class="row-price">'+rupees(p.price)+'</span><div class="quantity-control"><button data-qty="-1" data-id="'+p.id+'" aria-label="Decrease">−</button><span>'+i.quantity+'</span><button data-qty="1" data-id="'+p.id+'" aria-label="Increase">+</button><button class="remove-item" data-remove="'+p.id+'">Remove</button></div></div><b class="row-price">'+rupees(p.price*i.quantity)+'</b></div>':''}).join('');
}
function openCart(){closeProduct();$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');$('#overlay').classList.add('active');document.body.classList.add('locked')}
function closeCart(){$('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');$('#overlay').classList.remove('active');document.body.classList.remove('locked')}
function openProduct(id){
 const p=getProduct(id);if(!p)return;
 $('#modalBody').innerHTML='<div class="modal-visual">'+visual(p.kind)+'</div><div class="modal-detail"><p class="eyebrow">'+p.category+' · SAMPLE ITEM</p><h2>'+p.name+'</h2><p class="modal-desc">'+p.description+'</p><div class="modal-price">'+rupees(p.price)+'<small>Illustrative price · Replace with live catalogue data</small></div><ul class="spec-list">'+p.specs.map(x=>'<li>'+x+'</li>').join('')+'</ul><div class="modal-actions"><button class="button buy-now" data-modal-buy="'+p.id+'">Buy now <span>→</span></button><button class="button button-dark" data-modal-add="'+p.id+'">Add to bag</button></div><p class="modal-sample">Storefront preview. Product details and prices are examples.</p></div>';
 $('#productModal').classList.add('open');$('#modalBackdrop').classList.add('active');document.body.classList.add('locked');
}
function closeProduct(){$('#productModal').classList.remove('open');$('#modalBackdrop').classList.remove('active');if(!$('#cartDrawer').classList.contains('open')&&!$('#checkoutModal').classList.contains('open'))document.body.classList.remove('locked')}
function checkoutSummary(){
 const total=cart.reduce((n,i)=>n+(getProduct(i.id)?.price||0)*i.quantity,0);
 return '<div class="checkout-wrap"><form class="checkout-form" id="checkoutForm"><p class="eyebrow">ALMOST YOURS</p><h2>Checkout</h2><p>Enter your details to preview the order flow.</p><div class="demo-payment-note"><b>Preview only:</b> This form does not send or save personal details and does not collect payment. A live gateway and secure server are not connected.</div><label for="buyerName">Full name</label><input id="buyerName" name="name" autocomplete="name" required placeholder="Your name"><div class="form-two"><div><label for="buyerEmail">Email</label><input id="buyerEmail" type="email" name="email" autocomplete="email" required placeholder="you@example.com"></div><div><label for="buyerPhone">Phone</label><input id="buyerPhone" type="tel" name="phone" autocomplete="tel" required pattern="[0-9+ ()-]{8,16}" placeholder="Mobile number"></div></div><label for="buyerAddress">Delivery address</label><input id="buyerAddress" name="address" autocomplete="street-address" required placeholder="Street, area, city and PIN code"><label for="paymentChoice">Payment preference (preview)</label><select id="paymentChoice"><option>UPI</option><option>Credit or debit card</option><option>Cash on delivery</option></select><button class="button button-dark" type="submit">Preview order · '+rupees(total)+' <span>→</span></button></form><aside class="order-summary"><h3>Order summary</h3><div class="summary-lines">'+cart.map(i=>{const p=getProduct(i.id);return '<div class="summary-item"><span>'+p.name+' × '+i.quantity+'</span><span>'+rupees(p.price*i.quantity)+'</span></div>'}).join('')+'</div><div class="summary-totals"><div class="subtotal-line"><span>Subtotal</span><span>'+rupees(total)+'</span></div><div class="subtotal-line"><span>Delivery</span><span>Calculated later</span></div><div class="summary-total"><span>Estimated total</span><span>'+rupees(total)+'</span></div></div><p class="modal-sample">Taxes, delivery rates and stock need configuration for a real store.</p></aside></div>';
}
function openCheckout(){if(!cart.length)return;closeCart();$('#checkoutContent').innerHTML=checkoutSummary();$('#checkoutModal').classList.add('open');$('#modalBackdrop').classList.add('active');document.body.classList.add('locked')}
function closeCheckout(){$('#checkoutModal').classList.remove('open');$('#modalBackdrop').classList.remove('active');document.body.classList.remove('locked')}
function confirmSampleOrder(e){e.preventDefault();const name=$('#buyerName').value.trim().split(/\s+/)[0]||'there';$('#checkoutContent').innerHTML='<div class="checkout-success"><div class="success-mark">✓</div><p class="eyebrow">PREVIEW COMPLETE</p><h2>Thanks, '+name+'.</h2><p>This was a local preview only. No order was placed, no details stored, and no payment taken. Connect a secure commerce backend and payment provider to accept real orders.</p><button class="button button-dark" id="finishPreview">Back to the store <span>↗</span></button></div>';cart=[];saveCart();renderCart();$('#finishPreview').addEventListener('click',closeCheckout)}
$('#productGrid').addEventListener('click',e=>{const add=e.target.closest('[data-add]'),fav=e.target.closest('[data-favorite]'),card=e.target.closest('[data-product]');if(add){e.stopPropagation();addToCart(add.dataset.add);return}if(fav){e.stopPropagation();fav.classList.toggle('liked');fav.textContent=fav.classList.contains('liked')?'♥':'♡';showToast(fav.classList.contains('liked')?'Saved to favourites':'Removed from favourites');return}if(card)openProduct(card.dataset.product)});
$('#productGrid').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.product-card')){e.preventDefault();openProduct(e.target.dataset.product)}});
$$('.filter-chip').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.category)));
$$('.category-tile').forEach(b=>b.addEventListener('click',()=>{setCategory(b.dataset.category);$('#shop').scrollIntoView({behavior:'smooth'})}));
$$('[data-nav-category]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.navCategory)));
$('#sortSelect').addEventListener('change',e=>{sortMode=e.target.value;renderProducts()});
$('#searchInput').addEventListener('input',e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts()});
$('#clearSearch').addEventListener('click',()=>{$('#searchInput').value='';searchTerm='';renderProducts();$('#searchInput').focus()});
$('.search-toggle').addEventListener('click',()=>{const b=$('.search-bar');b.classList.toggle('open');b.setAttribute('aria-hidden',String(!b.classList.contains('open')));if(b.classList.contains('open'))setTimeout(()=>$('#searchInput').focus(),220)});
$('.cart-trigger').addEventListener('click',openCart);$('.close-drawer').addEventListener('click',closeCart);$('#overlay').addEventListener('click',closeCart);
$('.continue-shopping').addEventListener('click',()=>{closeCart();$('#shop').scrollIntoView({behavior:'smooth'})});$('.checkout-open').addEventListener('click',openCheckout);
$('.modal-close').addEventListener('click',closeProduct);$('.checkout-close').addEventListener('click',closeCheckout);$('#modalBackdrop').addEventListener('click',()=>{closeProduct();closeCheckout()});
$('#modalBody').addEventListener('click',e=>{const b=e.target.closest('[data-modal-buy],[data-modal-add]');if(b){addToCart(b.dataset.modalBuy||b.dataset.modalAdd);openCart()}});
$('#cartItems').addEventListener('click',e=>{const q=e.target.closest('[data-qty]'),r=e.target.closest('[data-remove]');if(q){const i=cart.find(x=>x.id===q.dataset.id);if(i){i.quantity+=Number(q.dataset.qty);if(i.quantity<1)cart=cart.filter(x=>x.id!==q.dataset.id)}saveCart();renderCart()}if(r){cart=cart.filter(x=>x.id!==r.dataset.remove);saveCart();renderCart()}});
$('#checkoutContent').addEventListener('submit',e=>{if(e.target.id==='checkoutForm')confirmSampleOrder(e)});
$('#resetFilters').addEventListener('click',()=>{searchTerm='';$('#searchInput').value='';setCategory('All')});
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();showToast('Newsletter sign-up will be connected on the live site');e.target.reset()});
$('.menu-toggle').addEventListener('click',()=>$('.main-nav').classList.toggle('open'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeProduct();closeCheckout()}});
$('#heroDevice').addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;e.currentTarget.style.transform='translate(calc(-50% + '+(x*15)+'px),calc(-50% + '+(y*12)+'px)) rotateY('+(-25+x*10)+'deg) rotateX('+(5-y*8)+'deg) rotateZ(-8deg)'});
$('#heroDevice').addEventListener('pointerleave',e=>e.currentTarget.style.transform='');
window.addEventListener('scroll',()=>{$('.site-header').classList.toggle('scrolled',scrollY>20);onScrollDepth()},{passive:true});
if('IntersectionObserver'in window){const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.13});$$('.category-section,.featured,.products-section,.promise-section,.newsletter').forEach(el=>{el.classList.add('reveal');ob.observe(el)})}
$('#year').textContent=new Date().getFullYear();renderProducts();renderCart();window.addEventListener('resize',onScrollDepth,{passive:true});
