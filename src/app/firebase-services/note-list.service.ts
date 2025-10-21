import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, collectionData, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes:Note[] = [];
  normalNotes:Note[] = [];
  normalMarkedNotes:Note[] = [];

  /* unsubList;     //ausgeklammert da beispiel
  unsubSingle; */
  unsubNotes;
  unsubMarkedNotes;
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
    this.unsubMarkedNotes = this.subMarkedNotesList();
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
    this.unsubMarkedNotes();
    this.unsubTrash();
    // this.items.unsubscribe(); //rausgenommen, gehört zu collectionData und subscribe 
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  subNotesList() {      //with filter (limit)
    const q = query(this.getNotesRef(), limit(3));
    // const q = query(this.getNotesRef(), orderBy("title"), limit(3));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(e => {
        this.normalNotes.push(this.setNoteObject(e.data(), e.id));
      });
    });
  }

  subMarkedNotesList() {      //with filter (where)
    const q = query(this.getNotesRef(), where("marked", "==", false), limit(3));
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach(e => {
        this.normalMarkedNotes.push(this.setNoteObject(e.data(), e.id));
      });
    });
  }

  /* subNotesList() {     //without filter
    const q = query(this.getNotesRef(), where("state", "==", "CA"));
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(e => {
        this.normalNotes.push(this.setNoteObject(e.data(), e.id));
      });
    });
  } */

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

  async addNote(item:Note, colId:"note" | "trash") {
    if(colId == "note") {
      await addDoc(this.getNotesRef(), item).catch(
        (err) => { console.error(err) }
      )
    } else {
      await addDoc(this.getTrashRef(), item).catch(
        (err) => { console.error(err) }
      )
    }
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
    };
  }

  async deleteNote(colId:string, docId:string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => { console.error(err) }
    );
  }
}
