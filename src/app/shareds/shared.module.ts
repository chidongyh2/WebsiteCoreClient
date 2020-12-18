import { AccordionDirective } from './directives/accordion/accordion.directive';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { ClickOutsideModule } from "ng-click-outside";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { AccordionAnchorDirective, AccordionLinkDirective } from "./directives/accordion";
import { CardComponent } from './components/card/card.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule,
        PerfectScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        ClickOutsideModule
    ],
    declarations: [
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        CardComponent
    ],
    exports: [
        TranslateModule,
        PerfectScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        ClickOutsideModule,
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        CardComponent
    ]
})
export class SharedModule {
}
