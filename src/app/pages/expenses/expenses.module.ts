import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExpensesRoutingModule } from '@expenses/expenses-routing.module';
import { ExpensesViewComponent } from '@expenses/expenses-view/expenses-view.component';
import { CashFlowModule } from '@features/cash-flow/cash-flow.module';
import { UiModule } from '@features/ui/ui.module';

// PrimeNg
import { DividerModule } from 'primeng/divider';

const declarations: Array<any> = [ExpensesViewComponent];
const imports: Array<any> = [CommonModule, ExpensesRoutingModule, CashFlowModule, DividerModule, UiModule];

@NgModule({ declarations, imports })
export class ExpensesModule {}
