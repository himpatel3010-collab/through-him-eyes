const photos=["1794215905790.jpg", "1794215936275.jpg", "1794215936292.jpg", "1794215936310.jpg", "1794216104485.jpg", "1794216104506.jpg", "1794216104526.jpg", "1794216104545.jpg", "1794216347704.jpg", "1794216347729.jpg", "1794216468580.jpg", "1794216547252.jpg", "1794216547262.jpg", "1794216620623.jpg", "1794216620640.jpg", "1794216683646.jpg", "1794216829049.jpg", "1794216829065.jpg", "1794216829079.jpg", "1794216829090.jpg", "1794216829102.jpg", "1794217453453.jpg", "1794217495141.jpg", "1794217632436.jpg", "1794217663814.jpg", "1794217680970.jpg", "1794217733199.jpg", "1794217773556.jpg", "1794217822524.jpg", "1794217890371.jpg", "1794218036390.jpg", "1794218093569.jpg", "1794218141067.jpg", "1794218170131.jpg", "1794218200074.jpg", "1794218371564.jpg", "1794218402253.jpg", "1794218448219.jpg", "1794218882658.jpg", "1794218992614.jpg", "1794219062326.jpg", "1794219106961.jpg", "DSC_0727.JPG", "IMG-20181108-WA0036.jpg", "IMG20171022122224.jpg", "IMG20181107094651.jpg", "IMG20190816175602.jpg", "IMG20191028162946.jpg", "IMG_20170526_191453_1495819692528.jpg", "IMG_20180416_194532.jpg", "IMG_20190519_103930_919.jpg", "IMG_4052.jpg", "IMG_4243.JPG"];
const videos=["Snapchat-1563158150.mp4", "Snapchat-2041849447.mp4", "Snapchat-356501887.mp4"];
const stream=document.getElementById('memoryStream');
const gallery=document.getElementById('gallery');
const landing=document.getElementById('landing');
const media=[...photos.map((src)=>({src,type:'image'})),...videos.map((src)=>({src,type:'video'}))];
document.getElementById('countLabel').textContent=`${media.length} MOMENTS`;
media.forEach((item,i)=>{
  const card=document.createElement('article');
  card.className='memory-item';
  card.dataset.index=i;
  const frame=document.createElement('div');frame.className='memory-frame';
  let el;
  if(item.type==='video'){el=document.createElement('video');el.src='assets/'+item.src;el.controls=false;el.muted=true;el.playsInline=true;el.preload='metadata';}
  else{el=document.createElement('img');el.src='assets/'+item.src;el.alt=`Photograph ${i+1} captured through my eyes`;el.loading=i<4?'eager':'lazy';}
  frame.appendChild(el);
  const cap=document.createElement('span');cap.className='memory-caption';cap.textContent=item.type==='video'?'A little moving memory':(['A moment worth keeping','Somewhere I wandered','A frame from my days','Little things, big memories'][i%4]);
  const idx=document.createElement('span');idx.className='memory-index';idx.textContent=String(i+1).padStart(2,'0');
  frame.append(cap,idx);card.appendChild(frame);
  if(i<media.length-1){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 65');svg.setAttribute('class','path-arrow');svg.innerHTML='<path d="M3 8 C28 57 60 55 88 20"/><path d="M77 18 L89 19 L86 31"/>';card.appendChild(svg);}
  card.addEventListener('click',()=>openLightbox(i));stream.appendChild(card);
});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});
document.querySelectorAll('.memory-item').forEach(el=>observer.observe(el));
const enterButton=document.getElementById('enterBtn');
enterButton.addEventListener('click',()=>{
  if(landing.classList.contains('opening')) return;
  landing.classList.add('opening');
  enterButton.disabled=true;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay=reduced?30:820;
  window.setTimeout(()=>{
    gallery.classList.add('show');
    gallery.scrollIntoView({behavior:reduced?'auto':'smooth'});
    landing.classList.remove('opening');
    enterButton.disabled=false;
  },delay);
});

// Subtle lens parallax: follows mouse on desktop and touch movement on mobile.
const lensStage=document.getElementById('lensStage');
if(lensStage){
  lensStage.addEventListener('pointermove',(event)=>{
    const rect=lensStage.getBoundingClientRect();
    const x=((event.clientX-rect.left)/rect.width-.5)*2;
    const y=((event.clientY-rect.top)/rect.height-.5)*2;
    lensStage.style.setProperty('--mx',(x*18).toFixed(2)+'px');
    lensStage.style.setProperty('--my',(y*18).toFixed(2)+'px');
  });
  lensStage.addEventListener('pointerleave',()=>{
    lensStage.style.setProperty('--mx','0px');
    lensStage.style.setProperty('--my','0px');
  });
}
document.getElementById('backTop').addEventListener('click',()=>{landing.scrollIntoView({behavior:'smooth'});});
const lightbox=document.getElementById('lightbox'),content=document.getElementById('lightboxContent'),caption=document.getElementById('lightboxCaption');
let current=0;
function openLightbox(i){current=i;renderLightbox();lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function renderLightbox(){const item=media[current];content.innerHTML='';let el=document.createElement(item.type==='video'?'video':'img');el.src='assets/'+item.src;if(item.type==='video'){el.controls=true;el.autoplay=true;el.playsInline=true;}else el.alt='Expanded photograph';content.appendChild(el);caption.textContent=`${String(current+1).padStart(2,'0')} / ${media.length}`;}
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');content.innerHTML='';document.body.style.overflow='';}
function move(n){current=(current+n+media.length)%media.length;renderLightbox();}
document.getElementById('closeLightbox').addEventListener('click',closeLightbox);
document.getElementById('prevPhoto').addEventListener('click',()=>move(-1));
document.getElementById('nextPhoto').addEventListener('click',()=>move(1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);});
let touchX=0;lightbox.addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});lightbox.addEventListener('touchend',e=>{let dx=e.changedTouches[0].screenX-touchX;if(Math.abs(dx)>45)move(dx<0?1:-1);},{passive:true});
