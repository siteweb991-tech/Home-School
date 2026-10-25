const readerParams=new URLSearchParams(location.search);const file=readerParams.get('file')||'';const title=readerParams.get('title')||'Document PDF';
const q=s=>document.querySelector(s);
if(!/^public\/examens\/(national|regional)\/(math|pc)\/202[0-5]\/[a-z0-9-]+\.pdf$/.test(file)){
 q('#reader').innerHTML='<div class="reader-error"><h1>Document introuvable</h1><p>Choisissez un document depuis la page des examens.</p><a class="gold" href="examens">Voir les examens</a></div>';
}else{
 q('#document-title').textContent=title;document.title=title+' | Home School';q('#open-pdf').href=file;q('#download-pdf').href=file;
 let pdf=null,pageNumber=1,zoom=1,renderTask=null,version=0;
 const canvas=q('#pdf-canvas'),status=q('#pdf-status');
 function updateControls(){q('#previous-page').disabled=!pdf||pageNumber<=1;q('#next-page').disabled=!pdf||pageNumber>=pdf.numPages;q('#page-number').value=pageNumber;q('#page-number').max=pdf?.numPages||1;q('#page-total').textContent='/ '+(pdf?.numPages||'…');q('#zoom-value').textContent=Math.round(zoom*100)+' %';q('#zoom-out').disabled=zoom<=.6;q('#zoom-in').disabled=zoom>=2.5;}
 async function renderPage(){
  if(!pdf)return;const request=++version;
  if(renderTask){renderTask.cancel();await renderTask.promise.catch(()=>{});}
  status.textContent='Affichage de la page '+pageNumber+'…';updateControls();
  try{
   const page=await pdf.getPage(pageNumber);if(request!==version)return;
   const original=page.getViewport({scale:1});const available=Math.max(230,Math.min(1100,q('#reader-pages').clientWidth-32));const viewport=page.getViewport({scale:available/original.width*zoom});const outputScale=Math.min(window.devicePixelRatio||1,2);
   canvas.width=Math.floor(viewport.width*outputScale);canvas.height=Math.floor(viewport.height*outputScale);canvas.style.width=Math.floor(viewport.width)+'px';canvas.style.height=Math.floor(viewport.height)+'px';canvas.setAttribute('aria-label','Page '+pageNumber+' sur '+pdf.numPages+' — '+title);
   renderTask=page.render({canvasContext:canvas.getContext('2d'),viewport,transform:outputScale!==1?[outputScale,0,0,outputScale,0,0]:null});await renderTask.promise;
   if(request===version){status.textContent='Page '+pageNumber+' sur '+pdf.numPages;renderTask=null;}
  }catch(error){if(error.name!=='RenderingCancelledException'&&request===version)status.textContent='Cette page ne peut pas être affichée. Vous pouvez ouvrir ou télécharger le PDF avec les boutons ci-dessus.';}
 }
 q('#previous-page').addEventListener('click',()=>{if(pdf&&pageNumber>1){pageNumber--;renderPage();}});q('#next-page').addEventListener('click',()=>{if(pdf&&pageNumber<pdf.numPages){pageNumber++;renderPage();}});q('#page-number').addEventListener('change',()=>{pageNumber=Math.min(pdf?.numPages||1,Math.max(1,Math.trunc(Number(q('#page-number').value)||1)));renderPage();});q('#zoom-in').addEventListener('click',()=>{zoom=Math.min(2.5,Math.round((zoom+.2)*10)/10);renderPage();});q('#zoom-out').addEventListener('click',()=>{zoom=Math.max(.6,Math.round((zoom-.2)*10)/10);renderPage();});let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderPage,160);});
 try{
  const pdfjs=await import('./public/vendor/pdfjs/pdf.mjs');pdfjs.GlobalWorkerOptions.workerSrc=new URL('./public/vendor/pdfjs/pdf.worker.mjs',import.meta.url).href;
  pdf=await pdfjs.getDocument({url:file,cMapUrl:new URL('./public/vendor/pdfjs/cmaps/',import.meta.url).href,cMapPacked:true,standardFontDataUrl:new URL('./public/vendor/pdfjs/standard_fonts/',import.meta.url).href,wasmUrl:new URL('./public/vendor/pdfjs/wasm/',import.meta.url).href,iccUrl:new URL('./public/vendor/pdfjs/iccs/',import.meta.url).href}).promise;await renderPage();
 }catch(error){status.textContent='Le lecteur ne peut pas afficher ce document. Les boutons « Ouvrir le PDF » et « Télécharger » restent disponibles.';}
}
