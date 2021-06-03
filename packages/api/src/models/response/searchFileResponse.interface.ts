export interface StringOccurrence {
    lineNumber : number;
    occurrenceString : string;
}

export interface StringOccurrenceResponse {
    [key: number]: StringOccurrence;
}