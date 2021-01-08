import {
  Directive,
  Input,
  TemplateRef,
  OnInit,
  ElementRef,
  Inject,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  ApplicationRef,
  EmbeddedViewRef,
  OnDestroy,
} from '@angular/core'

import { fromEvent, zip, Subscription } from 'rxjs'
import { switchMap, takeUntil, map, debounceTime, tap } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common'
import { HoverCardContainerComponent } from './hover-card-container/hover-card-container.component'

 @Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[hoverCard]',
})
export class HoverCardDirective implements OnInit, OnDestroy {
  @Input() hoverCardTemplate: TemplateRef<any>
  @Input() hoverCard: any
  delay = 400
  container: ComponentRef<HoverCardContainerComponent>
  private position: {x: number, y: number} // cached position to wait for rendering
  private isShow: boolean
  private hovered: boolean
  startSubscription: Subscription
  updateSubscription: Subscription
  hideSubscription: Subscription

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: any,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {}

  ngOnInit() {
    if (!this.hoverCardTemplate) {
      return
    }

    const elm = this.elementRef.nativeElement as HTMLElement
    const getCoordinates = (ev: MouseEvent) => ({
      x: ev.clientX,
      y: ev.clientY,
    })

    const end$ = fromEvent(elm, 'mouseleave').pipe(
      tap(_ => this.hovered = false),
    )
    const start$ = fromEvent(elm, 'mouseenter').pipe(
      tap(_ => this.hovered = true),
      debounceTime(this.delay),
      map(getCoordinates)
    )

    const position$ = start$.pipe(
      switchMap(() => fromEvent(elm, 'mousemove').pipe(
        map(getCoordinates),
        takeUntil(end$),
      )),
    )

    this.startSubscription = start$.subscribe(this.show)
    this.updateSubscription = position$.subscribe(this.update)
    this.hideSubscription = zip(start$, end$).subscribe(this.hide)
  }

  ngOnDestroy() {
    if (this.startSubscription) {
      this.startSubscription.unsubscribe()
    }

    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe()
    }

    if (this.hideSubscription) {
      this.hideSubscription.unsubscribe()
    }

    this.hide()
  }

  private update = (coord: { x: number; y: number }) => {
    if (!this.container) {
      this.position = coord
      return
    }

    this.container.instance.position = this.calculatePosition(coord, this.container)
  }

  private calculatePosition(coord: { x: number; y: number }, container) {
    const domElem = (container.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement
    const elmBound = domElem.getBoundingClientRect()
    const x = coord.x + elmBound.width + 10 > window.innerWidth ?
      coord.x - elmBound.width - 5 : coord.x + 10
    const y = coord.y + elmBound.height + 10 > window.innerHeight ?
      coord.y - elmBound.height - 5 : coord.y + 10
    return { x, y }
  }

  private hide = () => {
    this.isShow = false
    this.position = undefined
    if (!this.container) {
      return
    }

    this.appRef.detachView(this.container.hostView)
    this.container.destroy()
    this.container = undefined
  }

  private show = (position: { x: number, y: number }) => {
    if (!this.hovered) {
      return
    }

    this.isShow = true
    this.container = this.componentFactoryResolver
      .resolveComponentFactory(HoverCardContainerComponent)
      .create(this.injector)

    this.container.instance.templateRef = this.hoverCardTemplate
    this.container.instance.data = this.hoverCard
    this.appRef.attachView(this.container.hostView)

    // time consuming task
    const domElem = (this.container.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement
    this.document.body.appendChild(domElem)

    this.update(this.position || position)

    if (!this.isShow) {
      // after long running render task, may be the component is destroyed
      this.hide()
    }
  }
}
