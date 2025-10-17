import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          "projectId":"danotes-37e5d",
          "appId":"1:181031662999:web:3e10b28e3ff775ebf7c0d2",
          "storageBucket":"danotes-37e5d.firebasestorage.app",
          "apiKey":"AIzaSyDxUrgHoZnEGKi19m_IE2476UXOX7gSi2w",
          "authDomain":"danotes-37e5d.firebaseapp.com",
          "messagingSenderId":"181031662999",
          // "projectNumber":"181031662999",
          // "version":"2"
        }
      ))
    ),
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
