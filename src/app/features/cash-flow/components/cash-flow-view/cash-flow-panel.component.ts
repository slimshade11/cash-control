import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CashFlow } from '@common/models/cash-flow.model';

@Component({
  selector: 'ctrl-cash-flow-panel',
  templateUrl: './cash-flow-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowPanelComponent {
  @Input() public cashFlowData!: CashFlow[];
  @Input() public isIncomeMode!: boolean;
  @Input() public isLoading!: boolean;

  @Output() public cashFlowSubmitData: EventEmitter<CashFlow> = new EventEmitter<CashFlow>();

  public emitCashFlowSubmitData(cashFlowSubmitData: CashFlow): void {
    this.cashFlowSubmitData.emit(cashFlowSubmitData);
  }
}