import { Component, Input, Renderer2, ElementRef, TemplateRef } from '@angular/core'

 @Component({
  selector: 'hover-card-container',
  templateUrl: './hover-card-container.component.html',
  styleUrls: ['./hover-card-container.component.scss']
})
export class HoverCardContainerComponent {
  templateRef: TemplateRef<any>
  data: any

  @Input() set position(value: {x: number, y: number}) {
    this.render.setStyle(this.elementRef.nativeElement, 'top', `${value.y + 10}px`)
    this.render.setStyle(this.elementRef.nativeElement, 'left', `${value.x + 10}px`)
  }
   constructor(
    private render: Renderer2,
    private elementRef: ElementRef
  ) { }
}
