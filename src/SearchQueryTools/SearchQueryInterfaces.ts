import {RcsbSearchAttributeType} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {
    AttributeTextQueryParameters, GroupNode, RequestOptions, SearchQuery, TerminalNode
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";
import {
    Service
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {AttributeFacetType, FilterFacetType} from "../SearchParseTools/SearchFacetInterface";

export interface SearchAttributeInterface {
    attribute: RcsbSearchAttributeType;
    value: AttributeTextQueryParameters['value'];
    operator: AttributeTextQueryParameters["operator"];
    service: Service.Text | Service.TextChem;
    negation?: boolean;
}

export type SearchQueryType = GroupNode | TerminalNode;
export type SearchRequestType = Omit<SearchQuery, "request_options"> & {request_options?: RequestOptionsType};
export type RequestOptionsType = Omit<RequestOptions, "facets"> & {
    facets: [(FilterFacetType|AttributeFacetType), ...(FilterFacetType|AttributeFacetType)[]];
};

