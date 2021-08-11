export interface WebStringOccurrence {
    snippet: string;
}

export interface WebPageOccurrence {
    type: string;
    url: string;
    match_snippets: WebStringOccurrence[];
}
