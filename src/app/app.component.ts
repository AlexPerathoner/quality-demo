import { Component, ContentChildren, QueryList } from '@angular/core';
import { WidgetComponent } from './widget/widget.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quality-demo';


  @ContentChildren(WidgetComponent) widgets!: QueryList<WidgetComponent>;

  get serializedWidgets(): string {
    return this.widgets ? this.widgets.map(p => p.id).join(', ') : '';
  }
}
