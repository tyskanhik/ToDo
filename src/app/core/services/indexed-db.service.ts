import { Injectable } from '@angular/core';
import { defer, from, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName = 'TodoAppDB';
  private dbVersion = 1;
  private dbReady$: Observable<IDBDatabase>;

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
            db.createObjectStore('tasks', { keyPath: 'id' })
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' })
          }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    )
  }

  getAllTasks(): Observable<Task[]> {
    return this.dbReady$.pipe(
      switchMap(db => 
        from(new Promise<Task[]>((resolve) => {
          const transaction = db.transaction('tasks', 'readonly')
          const store = transaction.objectStore('tasks')
          const request = store.getAll()

          request.onsuccess = () => resolve(request.result || [])
          request.onerror = () => resolve([])
        }))
    ))
  }

  saveAllTasks(tasks: Task[]): Observable<void> {
    return this.dbReady$.pipe(
      switchMap(db =>
        from(new Promise<void>((resolve, reject) => {
          const transaction = db.transaction('tasks', 'readwrite')
          const store = transaction.objectStore('tasks')
          const clearRequest = store.clear()
          
          clearRequest.onsuccess = () => {
            tasks.forEach(task => {
              store.add(task)
            })
            resolve()
          }
          
          clearRequest.onerror = () => reject(clearRequest.error)
        }))
      )
    )
  }
}