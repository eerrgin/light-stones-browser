(function () {
  "use strict";
  var form = document.getElementById("address-form");
  var input = document.getElementById("address");
  if (!form || !input) return;

  function destination(value) {
    var text = value.trim();
    if (!text) return null;
    if (/^(https?:\/\/)/i.test(text)) {
      try {
        var parsed = new URL(text);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.href;
      } catch (error) {}
    }
    if (/^(localhost|[\w-]+\.[a-z]{2,})(:\d+)?([/?#].*)?$/i.test(text)) {
      try { return new URL("https://" + text).href; } catch (error) {}
    }
    return "https://duckduckgo.com/?q=" + encodeURIComponent(text);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var target = destination(input.value);
    if (target) window.open(target, "_blank", "noopener,noreferrer");
  });

  var traceForm=document.getElementById("trace-form");
  var traceList=document.getElementById("trace-list");
  var traceCount=document.getElementById("trace-count");
  var traceStatus=document.getElementById("trace-status");
  var exportButton=document.getElementById("trace-export");
  var importButton=document.getElementById("trace-import-button");
  var importInput=document.getElementById("trace-import");
  var storageKey="light-stones.trace.v1";
  var relationLabels={new:"YENİ İZ",supports:"DESTEKLİYOR",challenges:"SORGULUYOR",extends:"GENİŞLETİYOR"};
  function safeSourceUrl(value){try{var u=new URL(value);return u.protocol==="https:"||u.protocol==="http:";}catch(e){return false;}}
  function validTrace(item){return !!item&&typeof item==="object"&&typeof item.title==="string"&&typeof item.claim==="string"&&typeof item.url==="string"&&safeSourceUrl(item.url)&&["new","supports","challenges","extends"].indexOf(item.relation)!==-1;}
  function loadTraces(){try{var raw=localStorage.getItem(storageKey);var parsed=raw?JSON.parse(raw):[];return Array.isArray(parsed)?parsed.filter(validTrace).slice(0,500):[];}catch(e){return [];}}
  var traces=loadTraces();
  function persistTraces(){try{localStorage.setItem(storageKey,JSON.stringify(traces));traceStatus.textContent="Kaydedildi. Bu koleksiyon yalnızca bu tarayıcı profilinde durur.";return true;}catch(e){traceStatus.textContent="Tarayıcı depolaması kullanılamıyor veya dolu. Verilerini dışa aktarmayı dene.";return false;}}
  function el(tag,cls,value){var node=document.createElement(tag);if(cls)node.className=cls;if(value!==undefined)node.textContent=value;return node;}
  function renderTraces(){
    if(!traceList)return;
    traceCount.textContent=traces.length+" İZ";
    traceList.replaceChildren();
    if(!traces.length){var empty=el("div","trace-empty");empty.append(el("span","","✧"),el("b","","Henüz bir iz yok."),el("p","","İlk kaynağını ekle. Bilginin haritası burada oluşmaya başlayacak."));traceList.append(empty);return;}
    traces.slice().reverse().forEach(function(item){
      var card=el("article","trace-card"),top=el("div","trace-card-top");
      top.append(el("h4","",item.title),el("span","trace-relation",relationLabels[item.relation]||"YENİ İZ"));
      var link=el("a","",item.url);link.href=item.url;link.target="_blank";link.rel="noopener noreferrer";
      card.append(top,link,el("p","trace-claim","KAYNAK İDDİASI\n"+item.claim));
      if(item.note)card.append(el("p","","KİŞİSEL YORUM\n"+item.note));
      var foot=el("div","trace-card-foot"),date=new Date(item.createdAt);
      foot.append(el("span","trace-date",isNaN(date.getTime())?"Tarih belirtilmedi":date.toLocaleString("tr-TR")));
      var remove=el("button","trace-delete","Bu izi sil");remove.type="button";
      remove.addEventListener("click",function(){traces=traces.filter(function(x){return x.id!==item.id;});persistTraces();renderTraces();});
      foot.append(remove);card.append(foot);traceList.append(card);
    });
  }
  if(traceForm)traceForm.addEventListener("submit",function(event){
    event.preventDefault();var data=new FormData(traceForm);
    var title=String(data.get("title")||"").trim(),url=String(data.get("url")||"").trim(),claim=String(data.get("claim")||"").trim(),note=String(data.get("note")||"").trim(),relation=String(data.get("relation")||"new");
    if(!title||!claim||!safeSourceUrl(url)){traceStatus.textContent="Geçerli bir başlık, iddia ve HTTP/HTTPS kaynak bağlantısı gerekli.";return;}
    if(traces.length>=500){traceStatus.textContent="Koleksiyon 500 iz sınırına ulaştı. Önce dışa aktar veya bazı izleri sil.";return;}
    traces.push({id:(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2)),title:title.slice(0,120),url:url,claim:claim.slice(0,1000),note:note.slice(0,1000),relation:relationLabels[relation]?relation:"new",createdAt:new Date().toISOString()});
    if(persistTraces()){traceForm.reset();renderTraces();}
  });
  if(exportButton)exportButton.addEventListener("click",function(){
    var bundle={format:"light-stones-trace",version:1,exportedAt:new Date().toISOString(),author:"Ergin Kaplan",traces:traces};
    var blob=new Blob([JSON.stringify(bundle,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="light-stones-iz-koleksiyonu.json";document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
    traceStatus.textContent="İz koleksiyonun JSON dosyası olarak dışa aktarıldı.";
  });
  if(importButton&&importInput){
    importButton.addEventListener("click",function(){importInput.click();});
    importInput.addEventListener("change",function(){
      var file=importInput.files&&importInput.files[0];if(!file)return;
      if(file.size>2097152){traceStatus.textContent="Dosya 2 MB sınırını aşıyor.";importInput.value="";return;}
      var reader=new FileReader();
      reader.onload=function(){try{
        var parsed=JSON.parse(String(reader.result||"")),incoming=Array.isArray(parsed)?parsed:parsed.traces;
        if(!Array.isArray(incoming))throw new Error("invalid");
        var clean=incoming.filter(validTrace).slice(0,500);
        if(!clean.length&&incoming.length)throw new Error("invalid");
        var seen=new Set(traces.map(function(x){return x.id;}));
        clean.forEach(function(item){if(!seen.has(item.id)){traces.push(item);seen.add(item.id);}});
        traces=traces.slice(0,500);persistTraces();renderTraces();
        traceStatus.textContent=clean.length+" geçerli iz içe aktarıldı. Yinelenen kimlikler atlandı.";
      }catch(e){traceStatus.textContent="Dosya okunamadı. Light Stones JSON dışa aktarım dosyasını seç.";}importInput.value="";};
      reader.readAsText(file);
    });
  }
  renderTraces();
})();