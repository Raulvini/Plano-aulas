import { registerLocaleData } from '@angular/common';
import { ApplicationConfig, Component, LOCALE_ID, signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';

import { RouterOutlet } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(localePt);


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [
    provideNativeDateAdapter(), 
   
    
    { provide: LOCALE_ID, useValue: 'pt-BR' }// <--- Adicione aqui
    // ... outros providers como provideRouter
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('plano-aulas');
}
