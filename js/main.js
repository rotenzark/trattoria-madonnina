/* Trattoria Madonnina — interazioni, i18n, orari dinamici */
(function(){
  "use strict";

  /* ---------- intro ---------- */
  var intro=document.getElementById('intro');
  window.addEventListener('load',function(){ setTimeout(function(){ if(intro) intro.classList.add('gone'); },900); });
  setTimeout(function(){ if(intro) intro.classList.add('gone'); },2600);

  /* ---------- reveal ---------- */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.14});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- burger ---------- */
  var burger=document.getElementById('burger'), navlinks=document.getElementById('navlinks');
  if(burger){ burger.addEventListener('click',function(){ navlinks.classList.toggle('show'); }); }
  document.querySelectorAll('#navlinks a').forEach(function(a){ a.addEventListener('click',function(){ navlinks.classList.remove('show'); }); });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-q').forEach(function(b){
    b.addEventListener('click',function(){
      var it=b.parentElement, a=b.nextElementSibling;
      var open=it.classList.contains('open');
      it.classList.toggle('open');
      a.style.maxHeight=open?null:a.scrollHeight+'px';
    });
  });

  /* ---------- bocce motif (decorative circles) ---------- */
  (function(){
    var m=document.querySelector('.bocce-motif'); if(!m) return;
    var cfg=[[80,60,10],[200,140,16],[130,320,24],[520,90,14],[440,260,20],[300,200,12]];
    cfg.forEach(function(c){ var s=document.createElement('span'); s.style.left=c[0]+'px'; s.style.top=c[1]+'px'; s.style.width=(c[2]*4)+'px'; s.style.height=(c[2]*4)+'px'; m.appendChild(s); });
  })();

  /* ---------- ORARI dinamici ---------- */
  // getDay: 0=Dom,1=Lun..6=Sab · finestre in ore decimali; chiusura 24 = mezzanotte
  var HOURS={0:[[12,15.5]],1:[[12,15.5],[19,24]],2:[[12,15.5],[19,24]],3:[[12,15.5],[19,24]],4:[[12,15.5],[19,24]],5:[[12,15.5],[19,24]],6:[[12,15.5],[19,24]]};
  var DAYS_IT=['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  var DAYS_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function fmt(h){ if(h===24) return '24:00'; var H=Math.floor(h),M=Math.round((h-H)*60); H=H%24; return H+':'+(M<10?'0'+M:''+M); }
  function winStr(w){ return w.map(function(o){return fmt(o[0])+'–'+fmt(o[1]);}).join(' · '); }
  function romeNow(){ var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'}); return new Date(s); }
  function computeStatus(){
    var n=romeNow(), d=n.getDay(), h=n.getHours()+n.getMinutes()/60;
    var wins=HOURS[d]||[];
    for(var i=0;i<wins.length;i++){ if(h>=wins[i][0] && h<wins[i][1]) return {open:true, close:wins[i][1]}; }
    // prossima apertura oggi
    for(var j=0;j<wins.length;j++){ if(h<wins[j][0]) return {open:false, next:wins[j][0], nextDay:d}; }
    // cerca prossimo giorno aperto
    for(var k=1;k<=7;k++){ var dd=(d+k)%7; if((HOURS[dd]||[]).length){ return {open:false, next:HOURS[dd][0][0], nextDay:dd, other:true}; } }
    return {open:false};
  }
  var LANG='it';
  function renderHours(){
    var box=document.getElementById('hours'); if(!box) return;
    var days=LANG==='en'?DAYS_EN:DAYS_IT, today=romeNow().getDay(), out='';
    // ordine Lun..Dom
    var order=[1,2,3,4,5,6,0];
    order.forEach(function(d){
      var wins=HOURS[d], txt=wins&&wins.length?wins.map(winStr).join(''):(LANG==='en'?'Closed':'Chiuso');
      out+='<div class="hours-line'+(d===today?' today':'')+'"><span class="d">'+days[d]+'</span><span>'+txt+'</span></div>';
    });
    box.innerHTML=out;
    // status
    var st=computeStatus(), sb=document.getElementById('statusbox'), ab=document.getElementById('ab-state');
    var label,cls;
    if(st.open){ cls='open'; label=(LANG==='en'?'Open now · until ':'Aperto ora · fino alle ')+fmt(st.close); }
    else if(st.next!=null){
      var dayTxt = st.other ? (LANG==='en'?days[st.nextDay]+' ':days[st.nextDay]+' ') : '';
      cls='closed'; label=(LANG==='en'?'Closed · opens ':'Chiuso · apre ')+dayTxt+fmt(st.next);
    } else { cls='closed'; label=(LANG==='en'?'Closed':'Chiuso'); }
    if(sb) sb.innerHTML='<span class="status '+cls+'"><span class="dot"></span>'+label+'</span>';
    if(ab) ab.textContent=(st.open?(LANG==='en'?'Open now':'Aperto ora'):(LANG==='en'?'Closed now':'Ora chiuso'));
  }

  /* ---------- i18n ---------- */
  var EN={
    'nav.storia':'The story','nav.edicola':'The Madonnina','nav.menu':'The menu','nav.bocce':'The bocce court','nav.dove':'Find us','nav.cta':'Book',
    'hero.kicker':"Milan's oldest trattoria",'hero.h1':'In the shade of the',
    'hero.lead':'Since 1722, on Via Gentilino: Milanese home cooking, beamed ceilings, checked tablecloths and the dishes of always.',
    'hero.p1':'the founding year','hero.p2':'years of history','hero.p3':'2,346 reviews',
    'hero.cap':'The old-time bar counter, among relics and signs of old Milan',
    'storia.kicker':'Three centuries on Via Gentilino','storia.h2':'300 years of Milan',
    'storia.lead':'Before the city was here, there was <b>an inn with a kitchen</b>: since 1722, along the road that led to the Gentilino cemetery, where carriages and horses would stop.',
    'storia.p1':'All around were vegetable gardens and canals; artisans, bargemen and farmers passed by on their way to the centre. The Madonnina was already there, welcoming them with a hot plate and a glass.',
    'storia.p2':'In 2023 the trattoria changed hands without betraying its soul: "the spirit of old Milan with a touch of freshness", as its guests describe it today.',
    'storia.t1':'The Madonnina inn is born, on the road to the Gentilino.',
    'storia.t2y':'Early 1900s','storia.t2':'Bocce is played in the balcony courtyard: the historic Bocciofila Madonnina.',
    'storia.t3y':'The legend','storia.t3':'A young Giuseppe Di Stefano is "discovered" here, later returning with famous friends.',
    'storia.t4':'New management, same soul: the Milanese cooking of always.',
    'storia.cap':'The dining room: checked tablecloths and memories on the walls',
    'edic.kicker':'The name','edic.h2':'A votive shrine on the','edic.p1':'The name comes from a small <b style="color:var(--gold-2)">votive shrine</b> — a wooden Madonna — set on the building’s facade, to protect travellers from the misfortunes of the road.',
    'edic.p2':'For three centuries she has watched over those who stop here: the little shrine that gave the trattoria its name, and still welcomes everyone who enters.',
    'menu.kicker':"Grandmother's kitchen",'menu.h2':'The menu','menu.sub':'Milanese and Lombard cooking as it once was, following the market and the season.',
    'menu.note':'Some dishes change daily · ask for the blackboard',
    'menu.c1':'To begin','menu.d1n':'Mondeghili with saffron mayonnaise','menu.d1d':'Milanese fried meatballs, crisp outside and soft within.',
    'menu.d2n':'Cured meats & fried gnocco','menu.d2d':'Salumi with warm fried dough.',
    'menu.d3n':'Vitello tonnato','menu.d3d':'Thin veal slices with the classic tuna sauce.',
    'menu.d4n':'Veal tongue in green sauce','menu.d4d':'With sweet-and-sour red onion.',
    'menu.c2':'First courses','menu.d5n':'Risotto alla milanese','menu.d5d':'Rice creamed with saffron, an absolute classic.',
    'menu.d6n':'Risotto alla milanese with ossobuco','menu.d6d':'The saffron rice with its ossobuco: Milan’s signature dish.',
    'menu.d7n':'Tagliolini Madonnina with ossobuco ragù','menu.d7d':'The house pasta with the ossobuco sauce.',
    'menu.d8n':'Hand-pulled tortello, gorgonzola & pear','menu.d8d':'On a Raspadura fondue with mostarda.',
    'menu.c3':'Traditional mains','menu.d9n':'Cotoletta Madonnina alla milanese','menu.d9d':'With roast potatoes, tall and golden as tradition demands.',
    'menu.d10n':'Ossobuco alla milanese with polenta','menu.d10d':'Slowly braised, with its polenta.',
    'menu.d11n':'Milanese veal chop','menu.d11d':'With courgettes, cherry tomatoes and roast potatoes.',
    'menu.d12n':'Tripe alla milanese','menu.d12d':'With crusty bread, a great traditional dish.',
    'menu.c4':'Sides & desserts','menu.d13n':'The sides','menu.d13d':'Mashed potato with roast gravy, roast potatoes, fried polenta.',
    'menu.d14n':'Tiramisù & house desserts','menu.d14d':'Home-made, by the spoon, according to the day.',
    'menu.foot':'Average bill around 30–40 € per person, drinks excluded.',
    'bocce.kicker':'The courtyard remembers','bocce.h2':'The bocce court',
    'bocce.p1':'For most of the twentieth century, bocce was played in the Madonnina’s balcony courtyard: the <span class="em">Bocciofila Madonnina</span> was a much-loved neighbourhood gathering place.',
    'bocce.p2':'Until 1990 this was one of the last courts where the game was played <span class="em">"the Milanese way"</span> — a wider lane and diagonal throw. Today the old stable at the back has become the outdoor terrace, under the pergola.',
    'bocce.p3':'Sports bar, osteria and bocce club at once: the Madonnina has always been a piece of Milan that comes together.',
    'bocce.court':'the Milanese game',
    'gal.kicker':'At the table and in the room','gal.h2':'The gallery',
    'rev.src':'2,346 reviews on Google',
    'rev.q1':'A unique welcome made of smiles, banter and small kindnesses. Young, bright, professional and always prepared staff. Delicious food, from excellent ingredients to the cooking.',
    'rev.q2':'The spirit of old Milan with a touch of freshness. Returning to the Madonnina after the change of management was a wonderful surprise.',
    'rev.q3':'Risotto with ossobuco very good, and the board of cured meats with fried gnocco too. A true Milanese trattoria.',
    'rev.q4':'The waitresses very kind and helpful. I will come back with my family.',
    'dove.h2':'Find us','dove.addr':'Address','dove.phone':'Phone','dove.hours':'Opening hours','dove.call':'Call to book','dove.dir':'Get directions',
    'faq.kicker':'Frequently asked','faq.h2':'Good to know',
    'faq.q1':'Is the Madonnina really the oldest trattoria in Milan?','faq.a1':'An inn with the same name has stood here since 1722, along the old road to the Gentilino cemetery: that is why it is remembered as the city’s oldest trattoria.',
    'faq.q2':'Do I need to book?','faq.a2':'Recommended, especially for dinner and at the weekend. You can call 02 8940 9089.',
    'faq.q3':'What kind of cooking do you serve?','faq.a3':'Traditional Milanese and Lombard cooking: mondeghili, risotto alla milanese, ossobuco, cotoletta, tripe and home-made desserts. Some dishes change every day.',
    'faq.q4':'When are you open?','faq.a4':'Monday to Saturday for lunch (12–3:30pm) and dinner (7pm–midnight); Sunday lunch only (12–3:30pm).',
    'faq.q5':'Do you have outdoor seating?','faq.a5':'Yes: in the courtyard, where the old stable used to be, there is a terrace under the pergola.',
    'foot.sub':'In the shade of the Madonnina · since 1722','foot.rating':'4.1★ on Google (2,346 reviews)',
    'foot.demo':'Demo website by Bespoke Studio. Content and reviews from public sources (Google Maps).',
    'ab.call':'Book','ab.map':'Map'
  };
  var IT={}; // raccolto dal DOM al primo load
  function collectIT(){
    document.querySelectorAll('[data-i18n]').forEach(function(el){ IT[el.getAttribute('data-i18n')]=el.innerHTML; });
  }
  function apply(lang){
    LANG=lang;
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]!=null) el.innerHTML=dict[k];
      else if(lang==='it'&&IT[k]!=null) el.innerHTML=IT[k];
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-lang')===lang); });
    renderHours();
  }
  collectIT();
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click',function(){ apply(b.getAttribute('data-lang')); });
  });

  renderHours();
  setInterval(renderHours,60000);

  /* ---------- JSON-LD ---------- */
  var ld1={"@context":"https://schema.org","@type":"Restaurant","name":"Trattoria Madonnina","servesCuisine":["Milanese","Lombard","Italian"],"priceRange":"€€","image":"https://rotenzark.github.io/trattoria-madonnina/img/bancone.jpg","telephone":"+390289409089","url":"https://rotenzark.github.io/trattoria-madonnina/","address":{"@type":"PostalAddress","streetAddress":"Via Gentilino 6","addressLocality":"Milano","postalCode":"20136","addressCountry":"IT"},"geo":{"@type":"GeoCoordinates","latitude":45.4488889,"longitude":9.1808333},"sameAs":["https://instagram.com/trattoriamadonnina"],"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.1","reviewCount":"2346"},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"12:00","closes":"15:30"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"19:00","closes":"23:59"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"12:00","closes":"15:30"}]};
  var ld2={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"È davvero la trattoria più antica di Milano?","acceptedAnswer":{"@type":"Answer","text":"Un'osteria con lo stesso nome esiste in Via Gentilino dal 1722, lungo l'antica via per il cimitero del Gentilino."}},
    {"@type":"Question","name":"Serve prenotare?","acceptedAnswer":{"@type":"Answer","text":"Consigliato, soprattutto a cena e nel weekend. Telefono 02 8940 9089."}},
    {"@type":"Question","name":"Quando siete aperti?","acceptedAnswer":{"@type":"Answer","text":"Lunedì–sabato a pranzo (12–15:30) e a cena (19–24); domenica solo a pranzo (12–15:30)."}}
  ]};
  [ld1,ld2].forEach(function(o){ var s=document.createElement('script'); s.type='application/ld+json'; s.textContent=JSON.stringify(o); document.head.appendChild(s); });

})();
