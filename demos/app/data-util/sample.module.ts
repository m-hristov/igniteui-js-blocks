import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { IgxComponentsModule, IgxDirectivesModule } from "../../../src/main";
import { DataUtilSampleComponent, DataIterator, DataService } from "./sample.component";
import { HttpModule } from '@angular/http';

@NgModule({
    imports: [IgxComponentsModule, CommonModule, FormsModule, IgxDirectivesModule, HttpModule],
    declarations: [DataUtilSampleComponent, DataIterator]
})
export class DataUtilSampleModule {}