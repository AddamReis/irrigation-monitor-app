import { Injectable } from '@angular/core';
import { Database, ref, set, get, child, update, remove } from '@angular/fire/database';
import { onValue } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: Database) { }

  getData(path: string) {
    const dbRef = ref(this.db);
    return get(child(dbRef, path));
  }

  getDataRealTime(path: string): Observable<any> {
    const dbRef = ref(this.db, path);
    return new Observable(observer => {
      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        observer.next(data);
      }, {
        onlyOnce: false
      });
      return () => unsubscribe();
    });
  }

  addData(path: string, data: any) {
    const dbRef = ref(this.db, path);
    return set(dbRef, data);
  }

  updateData(path: string, data: any) {
    const dbRef = ref(this.db, path);
    return update(dbRef, data);
  }

  deleteData(path: string) {
    const dbRef = ref(this.db, path);
    return remove(dbRef);
  }
}
