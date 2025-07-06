import {OrderStatusType} from "../../../types/order-status.type";

export class OrderStatusUtil {

  static getStatusAndColor(status: OrderStatusType | undefined | null): { name: string, color: string } {
    let name: string = 'Новый';
    let color: string = '#456f49';
    switch (status) {
      case OrderStatusType.delivery:
        name = 'Доставка';
        break;
      case OrderStatusType.cancelled:
        name = 'Отменен';
        color = '#ff7575';
        break;
      case OrderStatusType.pending:
        name = 'Обработка';
        break;
      case OrderStatusType.success:
        name = 'Выполнен';
        color = '#b6d5b9';
        break;
    }
    return {name, color};
  }

}
