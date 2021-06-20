export interface WebStringOccurrence {
    lineNumber: number;
    occurrenceString: string;
}

export interface WebStringOccurrences {
    [key: number]: WebStringOccurrence;
}

export interface WebPageOccurrence {
    url: string;
    occurrences: WebStringOccurrences;
}

export interface WebOccurrencesResponse {
    [key: number]: WebPageOccurrence;
}