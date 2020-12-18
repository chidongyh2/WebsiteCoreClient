import {Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild} from '@angular/core';
import {cardToggle, cardClose, cardIconToggle} from './card-animation';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [cardToggle, cardClose, cardIconToggle],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {
  @Input() headerContent: string;
  @Input() title: string;
  @Input() blockClass: string;
  @Input() headerClass: string;
  @Input() cardClass: string;
  @Input() classHeader = false;
  @Input() cardOptionBlock = false;
  @Output() closeEmit = new EventEmitter<any>();
  @ViewChild(PerfectScrollbarComponent) perfectScroll: PerfectScrollbarComponent;
  cardToggle = 'expanded';
  cardClose = 'open';
  fullCard: string;
  fullCardIcon: string;
  loadCard = false;
  isCardToggled = false;
  cardLoad: string;
  cardIconToggle: string;
  @Input() isDashboard = true;
  constructor() {
    this.fullCardIcon = 'icon-maximize';
    this.cardIconToggle = 'an-off';
  }

  ngOnInit() {
    if (this.cardOptionBlock) {
      this.cardToggle = 'false';
    }
  }

  toggleCard(event) {
    this.cardToggle = this.cardToggle === 'collapsed' ? 'expanded' : 'collapsed';
  }

  toggleCardOption() {
    this.isCardToggled = !this.isCardToggled;
    this.cardIconToggle = this.cardIconToggle === 'an-off' ? 'an-animate' : 'an-off';
  }

  closeCard(event) {
    this.cardClose = this.cardClose === 'closed' ? 'open' : 'closed';
    this.closeEmit.emit('');
  }

  fullScreen(event) {
    this.fullCard = this.fullCard === 'full-card' ? '' : 'full-card';
    this.fullCardIcon = this.fullCardIcon === 'icon-maximize' ? 'icon-minimize' : 'icon-maximize';
  }

  cardRefresh() {
    this.loadCard = true;
    this.cardLoad = 'card-load';
    setTimeout( () => {
      this.cardLoad = '';
      this.loadCard = false;
    }, 3000);
  }

  getPerfectScroll() {
    return this.perfectScroll;
  }
}
