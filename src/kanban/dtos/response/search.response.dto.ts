import { KanbanItemResponseDto } from './kanban-board.response.dto';

export class SearchItemResponseDto extends KanbanItemResponseDto {
  _score?: number;
  _searchType?: 'fuzzy' | 'semantic';

  static fromItem(item: any): SearchItemResponseDto {
    return {
      ...KanbanItemResponseDto.fromEmailItem(item),
      _score: item?._score,
      _searchType: item?._searchType,
    };
  }
}

export class SearchResponseDto {
  results: SearchItemResponseDto[];

  static create(items: any[]): SearchResponseDto {
    return {
      results: (items ?? []).map((it) => SearchItemResponseDto.fromItem(it)),
    };
  }
}
