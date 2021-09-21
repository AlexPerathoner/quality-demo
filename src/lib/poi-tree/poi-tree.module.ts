import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatTreeModule } from '@angular/material/tree'
import { PoiTreeComponent } from './poi-tree.component'
import { ChecklistDatabase } from './poi-type-tree.service'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [PoiTreeComponent],
  exports: [PoiTreeComponent],
  providers: [ChecklistDatabase],
  imports: [CommonModule, MatTreeModule, MatCheckboxModule, FlexLayoutModule, MatButtonModule, MatIconModule],
})
export class PoiTreeModule {}
