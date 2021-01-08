import { NoResultsComponent } from './components/no-results/no-results.component';
import { MedLabelDirective } from './directives/med-label.directive';
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
import { LoadingComponent } from './components/loading/loading.component';
import { MedDropdownTreeComponent } from './components/med-dropdown-tree/med-dropdown-tree.component';
import { MedTreeComponent } from './components/med-dropdown-tree/med-tree/med-tree.component';
import { MedSelectDatetimeComponent } from './components/med-select-datetime/med-select-datetime.component';
import { MedSelectDateComponent } from './components/med-select-date/med-select-date.component';
import { MedSelectComponent } from './components/med-select/med-select.component';
import { MedMultipleSelectComponent } from './components/med-multiple-select/med-multiple-select.component';
import { MedCheckboxComponent } from './components/med-checkbox/med-checkbox.component';
import { MedMultiSelectListFilterPipe } from './components/med-multiple-select/med-multiple-select.directive';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MedInputComponent } from './components/med-input/med-input.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MedSwitchToggleComponent } from './components/med-switch-toggle/med-switch-toggle.component';
import { MedEditorComponent } from './components/med-textarea/med-editor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OutsideControlClickDirective } from './directives/outside-control-click.directive';
import { MedButtonComponent } from './components/med-button/med-button.component';
import { SortableDirective } from './components/data-table/sortable.directive';
import { DataTableCellTemplateDirective } from './components/data-table/data-table-cell-template.directive';
import { DataTableComponent } from './components/data-table/data-table.component';
import { HoverCardModule } from './components/hover-card/hover-card.module';
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule,
        PerfectScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        ClickOutsideModule,
        OwlDateTimeModule,
        CKEditorModule,
        OwlNativeDateTimeModule,
        HoverCardModule,
        SweetAlert2Module.forRoot()
    ],
    declarations: [
        // for template table
        DataTableComponent,
        DataTableCellTemplateDirective,
        SortableDirective,
        NoResultsComponent,
        // end for template table
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        CardComponent,
        LoadingComponent,
        MedDropdownTreeComponent,
        MedTreeComponent,
        MedSelectDatetimeComponent,
        MedSelectDateComponent,
        MedSelectComponent,
        MedMultipleSelectComponent,
        MedCheckboxComponent,
        MedMultiSelectListFilterPipe,
        MedLabelDirective,
        MedInputComponent,
        MedSwitchToggleComponent,
        MedEditorComponent,
        OutsideControlClickDirective,
        MedButtonComponent
    ],
    exports: [
        // for template table
        DataTableComponent,
        DataTableCellTemplateDirective,
        SortableDirective,
        NoResultsComponent,
        // end for template table
        TranslateModule,
        PerfectScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        ClickOutsideModule,
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        CardComponent,
        LoadingComponent,
        MedDropdownTreeComponent,
        MedTreeComponent,
        MedSelectDatetimeComponent,
        MedSelectDateComponent,
        MedSelectComponent,
        MedMultipleSelectComponent,
        MedCheckboxComponent,
        MedMultiSelectListFilterPipe,
        MedLabelDirective,
        MedInputComponent,
        MedSwitchToggleComponent,
        MedEditorComponent,
        SweetAlert2Module,
        OutsideControlClickDirective,
        MedButtonComponent
    ]
})
export class SharedModule {
}
