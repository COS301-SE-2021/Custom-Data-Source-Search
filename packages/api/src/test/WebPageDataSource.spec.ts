import webPageDataSourceService from "../services/WebPageDataSource.service";
import {StringOccurrences} from "../models/response/searchFileResponse.interface";
import {WebStringOccurrences} from "../models/response/searchWebPageResponse.interface";

const service = webPageDataSourceService;

describe('webPageDataSourceService : Individual Web Page Searching: ' , () => {
    it('Should return empty object when empty string is searched', () => {
        //given
        const mockPageContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "";
        //when
        const response: WebStringOccurrences = service.searchWebPage(mockPageContent,mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return empty object when searching for a string that is not contained in the page content', () =>{
        //given
        const mockPageContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: WebStringOccurrences = service.searchWebPage(mockPageContent,mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return two different occurrences of search string when page content contains two occurrences of the search string', () =>{
        //given
        const mockPageContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: WebStringOccurrences = service.searchWebPage(mockPageContent,mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);

        expect(response[1]).not.toBe(undefined);
        expect(response[1].occurrenceString).toContain(mockSearchString);
        expect(response[2]).toBe(undefined);


    });

    it('Should return empty object if the page content is empty', () => {
        //given
        const mockPageContent = "";
        const mockSearchString = "Gelato";
        //when
        const response: WebStringOccurrences = service.searchWebPage(mockPageContent,mockSearchString);
        //then
        expect(response).toEqual({});
    });

});