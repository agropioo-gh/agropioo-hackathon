/**
 * Service worker entry point (specs/offline-pwa/spec.md §FR-2–FR-5, §FR-16).
 * This file is compiled into /sw.js by @serwist/next's InjectManifest webpack
 * plugin during the build (triggered via `withSerwistInit` in next.config.ts).
 *
 * Serwist injects the precache manifest via `self.__WB_MANIFEST`.
 * Runtime caching routes are defined in lib/serwist/config.ts.
 *
 * FR-16: on SW activation, outdated caches are cleaned up.
 * EC-1: navigation fallback serves the locale-aware /offline page when no
 *       cached route exists.
 *
 * NOTE: We deliberately avoid `new Serwist({ ... })` here. The current
 * @serwist/next 9.5.x bundler emits a top-level `cacheNames` initializer
 * (`suffix: typeof registration !== "undefined" ? registration.scope : ""`)
 * whose minified output is invalid in some browser service-worker parsers,
 * causing "ServiceWorker script evaluation failed" on registration. The
 * minimal skeleton below keeps the precache manifest + navigation fallback
 * functional without that initializer.
 */

/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<string | { url: string; revision: string | null }>;
};

const PRECACHE_MANIFEST: Array<string | { url: string; revision: string | null }> =
  (self.__WB_MANIFEST as unknown as Array<string | { url: string; revision: string | null }>) ?? [];

const PRECACHE_CACHE = "agropioo-precache-v1";
const NAV_FALLBACK = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE_CACHE);
      await Promise.all(
        PRECACHE_MANIFEST.map(async (entry) => {
          const url = typeof entry === "string" ? entry : entry.url;
          try {
            await cache.add(url);
          } catch {
            // Ignore individual precache failures so one bad asset doesn't
            // abort the whole install (Serwist behaves the same way).
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("agropioo-precache-") && k !== PRECACHE_CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(PRECACHE_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        return fresh;
      } catch {
        if (req.mode === "navigate") {
          const fallback = await cache.match(NAV_FALLBACK);
          if (fallback) return fallback;
        }
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })(),
  );
});
