export class GmailLabelResponseDto {
  id: string;
  name: string;
  type: string;

  static fromGmailLabel(label: any): GmailLabelResponseDto {
    return {
      id: label.id,
      name: label.name,
      type: label.type,
    };
  }
}

export class GmailLabelsResponseDto {
  labels: GmailLabelResponseDto[];

  static create(labels: any[]): GmailLabelsResponseDto {
    return {
      labels: labels.map((label) =>
        GmailLabelResponseDto.fromGmailLabel(label),
      ),
    };
  }
}

export class ValidateLabelResponseDto {
  valid: boolean;
  message: string;
  actualName?: string;
  suggestions?: string[];
  hint?: string;

  static create(serviceResult: any): ValidateLabelResponseDto {
    return {
      valid: serviceResult.valid,
      message: serviceResult.message,
      actualName: serviceResult.actualName,
      suggestions: serviceResult.suggestions,
      hint: serviceResult.hint,
    };
  }
}
