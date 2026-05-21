const CACHE_NAME = "stoxen-cache-v0.0.1";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/style/global.css",
  "/assets/documents/arquivogerado.xlsx",
  "/assets/documents/manual.pdf",
  "/assets/image/shortcut.png",

  "json/ajustes.json",
  "json/codigoComunicacao.json",
  "json/contatos.json",
  "json/escalaSemanal.json",
  "json/infoAdicionais.json",
  "json/trocaFornecedor.json"
];

// Instalação
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = request.url;

  if (request.method !== "GET") return;


  // Json que devem atualizar sempre
  if (url.endsWith("json/ajustes.json")
    || url.endsWith("assets/documents/arquivogerado.xlsx")
    || url.endsWith("json/codigoComunicacao.json")
    || url.endsWith("json/contatos.json")
    || url.endsWith("json/escalaSemanal.json")
    || url.endsWith("json/infoAdicionais.json")
    || url.endsWith("json/trocaFornecedor.json")
    || url.endsWith("json/senhas.json")
    || url.endsWith("assets/documents/manual.pdf")

  ) {

    event.respondWith(
      fetch(request)
        .then(async response => {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Outros arquivos: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      return (
        cached ||
        fetch(request).then(async networkResponse => {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })
      );
    })
  );
});