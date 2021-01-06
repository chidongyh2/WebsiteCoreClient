import { Component, Input, HostBinding } from '@angular/core'
import { SafeStyle, DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: '[loading]',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent {

  @Input() loading: boolean
  @Input() minHeight = 80

  @HostBinding('style')
  get style(): SafeStyle {
    if (this.loading) {
      return this.sanitizer.bypassSecurityTrustStyle(`min-height: ${this.minHeight}px`)
    }
    return this.sanitizer.bypassSecurityTrustStyle('min-height: none')
  }

  constructor(private sanitizer: DomSanitizer) { }

}
