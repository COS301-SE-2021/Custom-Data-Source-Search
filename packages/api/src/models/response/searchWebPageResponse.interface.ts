export interface WebStringOccurrence {
    occurrenceString: string;
}

export interface WebPageOccurrence {
    type: string;
    url: string;
    occurrences: WebStringOccurrence[];
}
