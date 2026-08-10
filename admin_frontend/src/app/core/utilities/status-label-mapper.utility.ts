import { STATUS_LABELS } from '../constants';

export class StatusLabelMapper {
  static getStatusMeta(statusValue: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
    if (statusValue && STATUS_LABELS[statusValue]) {
      return STATUS_LABELS[statusValue];
    }
    return {
      label: statusValue ? statusValue.replace(/_/g, ' ') : 'Unknown',
      variant: 'neutral'
    };
  }
}
