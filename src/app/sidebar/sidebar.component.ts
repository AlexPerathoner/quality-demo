import { Component, Input } from '@angular/core'
import { Corner } from '../types/types'

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input()
  corner : Corner = 'top-left'
}
