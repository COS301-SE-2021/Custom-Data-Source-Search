export interface StringOccurrence {
    lineNumber : number;
    occurrenceString : string;

}

export interface StringOccurrences {
    [key: number]: StringOccurrence;

}

export interface StringOccurrencesResponse {
    [key: string]: StringOccurrences;
}