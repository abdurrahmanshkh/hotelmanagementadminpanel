export class CsvGenerator {
  static generateAndDownload<T extends Record<string, unknown>>(
    filename: string,
    headers: Array<{ key: keyof T; label: string }>,
    data: T[]
  ): void {
    const headerRow = headers.map(h => this.escapeCsvValue(h.label)).join(',');
    const dataRows = data.map(item => {
      return headers
        .map(h => {
          const val = item[h.key];
          return this.escapeCsvValue(val);
        })
        .join(',');
    });

    const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static escapeCsvValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '""';
    }
    const str = String(value);
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  }
}
