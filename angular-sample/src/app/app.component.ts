import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-sample';
  trackMoeEvent(): void {
    (window as any).Moengage.track_event('Sample', {integration: 'Angular'});
  }
}
