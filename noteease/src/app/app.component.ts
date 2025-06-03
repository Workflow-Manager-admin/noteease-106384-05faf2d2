import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoteeaseMainComponent } from './noteease-main/noteease-main.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NoteeaseMainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';
}
