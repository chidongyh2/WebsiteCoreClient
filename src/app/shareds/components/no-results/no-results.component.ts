import { Component, Input } from '@angular/core'

@Component({
  selector: 'no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss']
})
export class NoResultsComponent {
  @Input() message: string
  @Input() description: string
  @Input() icon: string
  @Input() image: string
  @Input() imageWidth: number
}
