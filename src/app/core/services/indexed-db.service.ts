import { Injectable } from '@angular/core';
import { defer, from, Observable, shareReplay, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName = 'TodoAppDB';
  private dbVersion = 1;
  private dbReady$: Observable<IDBDatabase>;
  private refresh$ = new Subject<void>();

  constructor() {
    this.dbReady$ = defer(() => this.initDB().pipe(
      shareReplay(1)
    ))
  }

  private initDB(): Observable<IDBDatabase> {
    return from(
      new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion)

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          if (!db.objectStoreNames.contains('tasks')) {
            db.createObjectStore('tasks', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    )
  }

  get<T>(storeName: string, key: string): Observable<T | null> {
    return this.dbReady$.pipe(
      switchMap(db => 
        from(new Promise<T | null>((resolve) => {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(key);

          request.onsuccess = () => resolve(request.result?.value || null);
          request.onerror = () => resolve(null);
        }))
      )
    )
  }

  set(storeName: string, key: string, value: any): Observable<void> {
    return this.dbReady$.pipe(
      switchMap(db =>
        from(new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put({ key, value });

          request.onsuccess = () => {
            this.refresh$.next();
            resolve();
          };
          request.onerror = () => reject(request.error);
        }))
      )
    )
  }
}
