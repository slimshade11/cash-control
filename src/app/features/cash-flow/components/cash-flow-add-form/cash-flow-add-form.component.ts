import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from '@auth/services/auth.service';
import { Category } from '@common/models/category.model';
import { User } from '@common/models/user.model';
import { BaseCashFlowForm } from '@features/cash-flow/abstract/base-cash-flow-form';
import { CashFlow } from '@features/cash-flow/models/cash-flow.model';
import { filter, Observable, take, tap } from 'rxjs';
import uniqid from 'uniqid';

@Component({
  selector: 'ctrl-cash-flow-add-form',
  templateUrl: './cash-flow-add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowAddFormComponent extends BaseCashFlowForm {
  @Input() public isIncomeMode!: boolean;

  @Output() public cashFlowSubmitData: EventEmitter<CashFlow> = new EventEmitter<CashFlow>();

  private userId!: string;

  public readonly categories$: Observable<Category[]> = this.getCategories$(this.isIncomeMode);

  constructor() {
    super();

    inject(AuthService)
      .authState$.pipe(
        take(1),
        filter(Boolean),
        tap(({ uid }: User): string => (this.userId = uid))
      )
      .subscribe();
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newCashFlow: CashFlow = {
      ...this.form.getRawValue(),
      date: Timestamp.fromDate(this.form.getRawValue().date!),
      uid: this.userId,
      id: uniqid(),
    };

    this.cashFlowSubmitData.emit(newCashFlow);
    this.form.reset();
  }
}
