import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@features/ui/ui.module';
import { CashFlowModule } from '@features/cash-flow/cash-flow.module';
import { IncomesRoutingModule } from '@incomes/incomes-routing.module';
import { IncomesViewComponent } from '@incomes/incomes-view/incomes-view.component';

// PrimeNg
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const declarations: Array<any> = [IncomesViewComponent];
const imports: Array<any> = [CommonModule, IncomesRoutingModule, CashFlowModule, ConfirmDialogModule, UiModule];

@NgModule({ declarations, imports })
export class IncomesModule {}
