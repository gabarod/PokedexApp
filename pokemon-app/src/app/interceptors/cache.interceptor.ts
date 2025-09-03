import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

const cache = new Map<string, { response: HttpResponse<any>; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests to PokeAPI
  if (req.method === 'GET' && req.url.includes('pokeapi.co')) {
    const cacheKey = req.urlWithParams || req.url;
    const cachedData = cache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      console.log('🎯 Cache HIT for:', req.url);
      return of(cachedData.response.clone());
    }
  }

  return next(req).pipe(
    tap(event => {
      // Cache successful GET responses from PokeAPI
      if (event instanceof HttpResponse && 
          req.method === 'GET' && 
          req.url.includes('pokeapi.co') && 
          event.status === 200) {
        const cacheKey = req.urlWithParams || req.url;
        cache.set(cacheKey, {
          response: event.clone(),
          timestamp: Date.now()
        });
        console.log('💾 Cached response for:', req.url);
        
        // Clean old cache entries (simple cleanup)
        if (cache.size > 100) {
          const oldestKey = cache.keys().next().value;
          if (oldestKey) {
            cache.delete(oldestKey);
          }
        }
      }
    })
  );
};