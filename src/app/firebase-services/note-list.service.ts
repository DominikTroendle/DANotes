import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, collectionData, doc, onSnapshot, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes:Note[] = [];
  normalNotes:Note[] = [];

  /* unsubList;     //ausgeklammert da beispiel
  unsubSingle; */
  unsubNotes;
  unsubTrash;

  /* items$;  //rausgenommen, gehört zu collectionData und subscribe
  items; */
  firestore: Firestore = inject(Firestore);
  
  constructor() {
    /* this.unsubList = onSnapshot(this.getNotesRef(), (list) => {        //ausgeklammert da beispiel
      list.forEach(element => {
        console.log(element);
        console.log(element.data());
        console.log(this.setNoteObject(element.data(), element.id));
        this.setNoteObject(element.data(), element.id);
      });
    });
    this.unsubSingle = onSnapshot(this.getSingleDocRef('notes', 'AkpL97d0oIDK19q6tu6H'), (el) => {
      console.log(el);
    }); */

    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();

    /* this.items$ = collectionData(this.getNotesRef());  //rausgenommmen, in diesem Projekt Fokus auf onSnapshot
    this.items = this.items$.subscribe((list) => {
      list.forEach(e => {
        console.log(e);
      });
    }); */
  }

  ngOnDestroy() {
    // this.unsubList();         //ausgeklammert da beispiel
    // this.unsubSingle();       //ausgeklammert da beispiel
    this.unsubNotes();
    this.unsubTrash();
    // this.items.unsubscribe(); //rausgenommen, gehört zu collectionData und subscribe 
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(e => {
        this.normalNotes.push(this.setNoteObject(e.data(), e.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(e => {
        this.trashNotes.push(this.setNoteObject(e.data(), e.id));
      });
    });
  }

  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }

  setNoteObject(obj:any, id:string):Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false
    }
  }

  async addNote(item: {}) {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log('Document written with ID: ', docRef?.id); }
    );
  }

  async updateNote(note:Note) {
    if(note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.error(err) }
      );
    }
  }

  getCleanJson(note:Note):{} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }

  getColIdFromNote(note:Note) {
    if(note.type == "note") {
      return "notes";
    } else {
      return "trash";
    }
  }
}
