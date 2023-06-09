import { Injectable } from '@angular/core';
import { CATEGORY_DIC } from '@common/dictionaries/category.dictionary';
import { CashFlowExpenseChartData, CashFlowIncomesChartData } from '@dashboard/models/cash-flow-chart-data.model';
import { CustomChartData } from '@dashboard/models/custom-chart-data.model';
import { CashFlow } from '@features/cash-flow/models/cash-flow.model';

@Injectable({ providedIn: 'root' })
export class ChartService {
  public getChartOptions(): any {
    const documentStyle: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    const textColor: string = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary: string = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder: string = documentStyle.getPropertyValue('--surface-border');

    return {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  public setChartExpensesData(expenses: CashFlow[]): CustomChartData {
    const { rentalFees, food, travel, entertainment } = this.mapChartExpensesData(expenses);

    return {
      labels: [rentalFees.label, food.label, travel.label, entertainment.label],
      datasets: [
        {
          label: 'Expenses',
          data: [rentalFees.amount, food.amount, travel.amount, entertainment.amount],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1,
        },
      ],
    };
  }

  public setChartIncomesData(incomes: CashFlow[]): CustomChartData {
    const { concerts, salary, gifts } = this.mapChartIncomesData(incomes);

    return {
      labels: [concerts.label, salary.label, gifts.label],
      datasets: [
        {
          label: 'Incomes',
          data: [concerts.amount, salary.amount, gifts.amount],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)'],
          borderWidth: 1,
        },
      ],
    };
  }

  private mapChartExpensesData(expenses: CashFlow[]): CashFlowExpenseChartData {
    const rentalFeesCashFlow: CashFlow[] = expenses.filter((cashFlow: CashFlow): boolean => cashFlow.categoryCode == 0);
    const travelCashFlow: CashFlow[] = expenses.filter((cashFlow: CashFlow): boolean => cashFlow.categoryCode == 1);
    const foodCashFlow: CashFlow[] = expenses.filter((cashFlow: CashFlow): boolean => cashFlow.categoryCode == 2);
    const entertainmentCashFlow: CashFlow[] = expenses.filter(
      (cashFlow: CashFlow): boolean => cashFlow.categoryCode == 3
    );

    return {
      rentalFees: {
        label: CATEGORY_DIC[0].icon,
        amount: rentalFeesCashFlow.reduce((acc: number, cashFlow: CashFlow) => {
          return acc + Number(cashFlow.amount);
        }, 0),
      },
      travel: {
        label: CATEGORY_DIC[1].icon,
        amount: travelCashFlow.reduce((acc: number, cashFlow: CashFlow) => {
          return acc + Number(cashFlow.amount);
        }, 0),
      },
      food: {
        label: CATEGORY_DIC[2].icon,
        amount: foodCashFlow.reduce((acc: number, cashFlow: CashFlow) => {
          return acc + Number(cashFlow.amount);
        }, 0),
      },
      entertainment: {
        label: CATEGORY_DIC[3].icon,
        amount: entertainmentCashFlow.reduce((acc: number, cashFlow: CashFlow) => {
          return acc + Number(cashFlow.amount);
        }, 0),
      },
    };
  }

  private mapChartIncomesData(incomes: CashFlow[]): CashFlowIncomesChartData {
    const concertsCashFlow: CashFlow[] = incomes.filter((cashFlow: CashFlow): boolean => cashFlow.categoryCode == 4);
    const salaryCashFlow: CashFlow[] = incomes.filter((cashFlow: CashFlow): boolean => cashFlow.categoryCode == 5);
    const giftsCashFlow: CashFlow[] = incomes.filter((cashFlow: CashFlow): boolean => cashFlow.categoryCode == 6);

    return {
      concerts: {
        label: CATEGORY_DIC[4].icon,
        amount: concertsCashFlow.reduce((acc: number, cashFlow: CashFlow) => {
          return acc + Number(cashFlow.amount);
        }, 0),
      },
      salary: {
        label: CATEGORY_DIC[5].icon,
        amount: salaryCashFlow.reduce((acc: number, cashFlow: CashFlow) => {
          return acc + Number(cashFlow.amount);
        }, 0),
      },
      gifts: {
        label: CATEGORY_DIC[6].icon,
        amount: giftsCashFlow.reduce((acc: number, cashFlow: CashFlow) => {
          return acc + Number(cashFlow.amount);
        }, 0),
      },
    };
  }
}
