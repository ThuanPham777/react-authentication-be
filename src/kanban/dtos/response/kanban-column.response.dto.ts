export class KanbanColumnResponseDto {
  id: string;
  name: string;
  gmailLabel?: string;
  order: number;
  color?: string;

  static fromColumn(column: any): KanbanColumnResponseDto {
    return {
      id: String(column.id ?? ''),
      name: column.name,
      gmailLabel: column.gmailLabel,
      order: Number.isFinite(Number(column.order)) ? Number(column.order) : 0,
      color: column.color,
    };
  }
}

export class KanbanColumnsResponseDto {
  columns: KanbanColumnResponseDto[];

  static create(columns: any[]): KanbanColumnsResponseDto {
    return {
      columns: columns.map((col) => KanbanColumnResponseDto.fromColumn(col)),
    };
  }
}
