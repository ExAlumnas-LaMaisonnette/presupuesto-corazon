/* Navegador lateral compartido por los dos sitios del proyecto (plan de implementación y presupuesto).
 * Lista todas las páginas con sus secciones; marca la página actual y la sección visible. Mismo archivo en ambos repositorios. */
(function(){
  var PLAN='https://exalumnas-lamaisonnette.github.io/plan-implementacion-corazon/', PRES='https://exalumnas-lamaisonnette.github.io/presupuesto-corazon/';
  var enPres=/presupuesto/i.test(location.pathname);
  var PAGES=[
    {site:'plan',file:'index.html',title:'Plan de implementación',secs:[['s1','01','Sentido de esta etapa'],['s2','02','Una obra construida desde la comunidad'],['s3','03','Concepto de la instalación final'],['s4','04','Activación de la comunidad'],['s5','05','Implementación y montaje'],['s6','06','Equipo responsable'],['s7','07','Apoyos requeridos al colegio'],['s8','08','Próximos pasos'],['s9','09','Permanencia posterior a la Velada Cultural']]},
    {site:'plan',file:'renders.html',title:'Renders',secs:[['entrada','01','Entrada'],['pasillo','02','Pasillo'],['inmersiva','03','Espacio inmersivo']]},
    {site:'plan',file:'pergola.html',title:'Pérgola',secs:[['donde','01','Dónde va'],['estructura','02','La estructura'],['vistas','03','Vistas 3D'],['fichas','04','Fichas técnicas'],['presupuesto','05','Presupuesto de materiales']]},
    {site:'pres',file:'index.html',title:'Presupuesto',secs:[['resumen','01','Resumen'],['zonas','02','Por zona'],['items','03','Detalle de compra'],['fuentes','04','Fuentes']]},
    {site:'pres',file:'pergola.html',title:'Presupuesto de la pérgola',secs:[]}
  ];
  var path=location.pathname.split('/').pop()||'index.html', site=enPres?'pres':'plan';
  function href(p){var local=p.site===site;var base=local?'':(p.site==='plan'?PLAN:PRES);return base+(p.file==='index.html'?(local?'./':''):p.file);}
  var nav=document.createElement('nav');nav.className='sidenav';nav.setAttribute('aria-label','Páginas del proyecto');
  var logo=enPres?'logo.png':'renders/logo.png';
  var html='<a class="sn-brand" href="'+(enPres?PLAN:'./')+'"><img src="'+logo+'" alt="La Maisonnette 90 años"><b>El Corazón de La Maisonnette</b><span>Proyecto 90 años</span></a><ul>';
  PAGES.forEach(function(p){
    var cur=p.site===site&&p.file===path;
    html+='<li class="page'+(cur?' current':'')+'"><a class="p" href="'+(href(p)||'./')+'">'+p.title+'</a>';
    if(p.secs.length){html+='<ul class="secs">'+p.secs.map(function(s){return '<li><a class="s" href="'+(cur?'':href(p))+'#'+s[0]+'"><span class="n">'+s[1]+'</span>'+s[2]+'</a></li>';}).join('')+'</ul>';}
    html+='</li>';
  });
  html+='</ul><div class="sn-foot">Proyecto “El Corazón de La Maisonnette” · 90 años</div>';
  nav.innerHTML=html;
  var btn=document.createElement('button');btn.className='sn-toggle';btn.type='button';btn.setAttribute('aria-label','Abrir navegación');
  var ABRIR='<span aria-hidden="true" style="font-size:18px;line-height:1">☰</span>Menú', CERRAR='<span aria-hidden="true" style="font-size:16px;line-height:1">✕</span>Cerrar';
  btn.innerHTML=ABRIR;
  document.body.appendChild(nav);document.body.appendChild(btn);
  function close(){nav.classList.remove('open');btn.innerHTML=ABRIR;}
  btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.innerHTML=o?CERRAR:ABRIR;});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  document.addEventListener('click',function(e){if(nav.classList.contains('open')&&!nav.contains(e.target)&&!btn.contains(e.target))close();});
  // secciones de la página actual: paneles con pestañas (presupuesto) o secciones que se recorren (plan)
  var links={};nav.querySelectorAll('li.current a.s').forEach(function(a){links[a.getAttribute('href').slice(1)]=a;});
  var ids=Object.keys(links);
  function tab(id){var t=document.querySelector('.tabs a[data-panel="'+id+'"]');if(t){t.click();return true;}return false;}
  function marcar(id){ids.forEach(function(k){links[k].classList.toggle('active',k===id);});}
  nav.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;close();var h=a.getAttribute('href');if(h&&h.charAt(0)==='#'&&tab(h.slice(1))){e.preventDefault();marcar(h.slice(1));history.replaceState(null,'',h);}});
  if(!ids.length)return;
  if(document.querySelector('.tabs a[data-panel]')){
    var h=location.hash.slice(1);if(h&&links[h])tab(h);
    var act=document.querySelector('.tabs a.active');marcar(act?act.dataset.panel:ids[0]);
    document.querySelectorAll('.tabs a[data-panel]').forEach(function(t){t.addEventListener('click',function(){marcar(t.dataset.panel);});});
    return;
  }
  if(!('IntersectionObserver' in window))return;
  var visible={};
  var io=new IntersectionObserver(function(es){es.forEach(function(en){visible[en.target.id]=en.isIntersecting?en.boundingClientRect.top:null;});
    var best=null;ids.forEach(function(id){var t=visible[id];if(t===null||t===undefined)return;if(best===null||Math.abs(t-120)<Math.abs(visible[best]-120))best=id;});
    if(best)marcar(best);
  },{rootMargin:'-10% 0px -55% 0px',threshold:[0,0.2,0.5,1]});
  ids.forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el);});
})();
