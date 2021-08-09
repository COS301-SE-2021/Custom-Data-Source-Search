export interface StringOccurrence {
    lineNumber: number;
    snippet: string;
}

export interface FileOccurrence {
    type: string;
    source: string;
    occurrences: StringOccurrence[];
}
