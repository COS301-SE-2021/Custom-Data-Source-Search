export interface StringOccurrence {
    lineNumber: number;
    occurrenceString: string;
}

export interface FileOccurrence {
    type: string;
    source: string;
    occurrences: StringOccurrence[];
}
