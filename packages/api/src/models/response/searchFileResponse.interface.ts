export interface StringOccurrence {
    lineNumber: number;
    occurrenceString: string;
}

export interface FileOccurrence {
    type: string;
    source: string;
    occurrences: StringOccurrence[];
}

export interface StringOccurrencesResponse {
    [key: number]: FileOccurrence;
}