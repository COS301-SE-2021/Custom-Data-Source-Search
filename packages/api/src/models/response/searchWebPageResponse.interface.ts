export interface WebStringOccurrence {
    occurrenceString: string;
}

export interface WebStringOccurrences {
    [key: number]: WebStringOccurrence;
}

export interface WebPageOccurrence {
    type: string;
    url: string;
    occurrences: WebStringOccurrences;
}

export interface WebOccurrencesResponse {
    [key: number]: WebPageOccurrence;
}