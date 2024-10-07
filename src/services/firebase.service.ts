import { Injectable } from '@angular/core';
import { Database, ref, set, get, child, update, remove } from '@angular/fire/database';
import { getDatabase } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: Database) { }

  addData(path: string, data: any) {
    const dbRef = ref(this.db, path);
    return set(dbRef, data);
  }

  getData(path: string) {
    const dbRef = ref(this.db);
    return get(child(dbRef, path));
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
