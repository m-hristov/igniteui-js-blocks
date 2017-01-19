import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { IgxComponentsModule, IgxDirectivesModule } from "../../../src/main";
import { DataUtil } from "../../../src/data-operations/data-util";
import { DataUtilSampleComponent, DataIterator } from "./sample.component";

@NgModule({
    imports: [IgxComponentsModule, CommonModule, FormsModule, IgxDirectivesModule],
    declarations: [DataUtilSampleComponent, DataIterator]
})
export class DataUtilSampleModule {}