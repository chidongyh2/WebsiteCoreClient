import { NgModule } from '@angular/core'
import { HoverCardContainerComponent } from './hover-card-container/hover-card-container.component'
import { HoverCardDirective } from './hover-card.directive'
import { CommonModule } from '@angular/common'

 @NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HoverCardContainerComponent,
    HoverCardDirective
  ],
  exports: [
    HoverCardContainerComponent,
    HoverCardDirective
  ],
  entryComponents: [
    HoverCardContainerComponent
  ]
})
export class HoverCardModule {
}
