export interface StringOccurrence {
    lineNumber: number;
    snippet: string;
}

export interface FileOccurrence {
    type: string;
    source: string;
    match_snippets: StringOccurrence[];
}
