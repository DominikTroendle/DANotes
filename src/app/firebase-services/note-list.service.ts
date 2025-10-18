import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubList;
  unsubSingle;

  items;
  firestore: Firestore = inject(Firestore);
  
  constructor() {
    this.unsubList = onSnapshot(this.getNotesRef(), (list) => {
      list.forEach(element => {
        console.log(element);
      });
    });
    this.unsubSingle = onSnapshot(this.getSingleDocRef('notes', 'AkpL97d0oIDK19q6tu6H'), (el) => {
      console.log(el);
    });
    this.unsubList();
    this.unsubSingle();
    this.items = collectionData(this.getNotesRef());
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
