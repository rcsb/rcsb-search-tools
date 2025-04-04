import {
    LogicalOperator,
    Type,
    ReturnType
} from "@rcsb/rcsb-api-tools/lib/RcsbSearch/Types/SearchEnums";
import {cloneDeep} from "lodash";
import {
    RequestOptionsType,
    SearchAttributeInterface,
    SearchQueryType,
    SearchRequestType
} from "./SearchQueryInterfaces";
import {AttributeFacetType, FilterFacetType} from "../SearchParseTools/SearchFacetInterface";


export function buildRequestFromAttribute(
    searchAttribute: SearchAttributeInterface,
    returnType: ReturnType,
    requestOptions?: RequestOptionsType
): SearchRequestType {
    return {
        query: buildAttributeQuery(searchAttribute),
        return_type: returnType,
        request_options: requestOptions
    }
}
export function buildRequestFromAttributeAndSearchQuery (
    searchAttribute: SearchAttributeInterface,
    searchQuery: SearchQueryType,
    returnType: ReturnType,
    logicalOperator = LogicalOperator.And,
    requestOptions?: RequestOptionsType
): SearchRequestType {
    return {
        query: addAttributeToSearchQuery(searchAttribute,searchQuery,logicalOperator),
        return_type: returnType,
        request_options: requestOptions
    }
}

export function buildRequestFromCombinedSearchQuery(
    additionalSearchQuery: SearchQueryType,
    searchQuery: SearchQueryType,
    returnType: ReturnType,
    logicalOperator = LogicalOperator.And,
    requestOptions?: RequestOptionsType
): SearchRequestType {
    return {
        query: combineSearchQuery(additionalSearchQuery,searchQuery),
        return_type: returnType,
        request_options: requestOptions
    }
}

export function buildRequestFromSearchQuery(
    searchQuery: SearchQueryType,
    returnType: ReturnType,
    requestOptions?: RequestOptionsType
): SearchRequestType {
    return {
        query: searchQuery,
        return_type: returnType,
        request_options:  requestOptions
    }
}

export function addAttributeToSearchQuery(
    searchAttribute: SearchAttributeInterface,
    searchQuery: SearchQueryType,
    logicalOperator = LogicalOperator.And
): SearchQueryType {
    return combineSearchQuery(
        buildAttributeQuery(searchAttribute),
        searchQuery,
        logicalOperator
    );
}
export function combineSearchQuery(
    additionalSearchQuery: SearchQueryType,
    searchQuery: SearchQueryType,
    logicalOperator = LogicalOperator.And
): SearchQueryType {

    if (searchQuery.type === Type.Group && searchQuery.logical_operator === logicalOperator) {
        const query: SearchQueryType = cloneDeep(searchQuery);
        query.nodes.push(additionalSearchQuery);
        return query;
    }
    return {
        type: Type.Group,
        logical_operator: logicalOperator,
        nodes: [
            searchQuery,
            additionalSearchQuery
        ]
    }

}

export function buildAttributeQuery(searchAttribute: SearchAttributeInterface): SearchQueryType {
    return {
        type: Type.Terminal,
        service: searchAttribute.service,
        parameters: {
            attribute: searchAttribute.attribute,
            negation: typeof searchAttribute.negation === "boolean" ? searchAttribute.negation : false,
            operator: searchAttribute.operator,
            value: searchAttribute.value
        }
    }
}

export function buildMultiFacet(addFacet: AttributeFacetType|FilterFacetType, toFacet: AttributeFacetType|FilterFacetType): void {
    if(Array.isArray(toFacet.facets)) {
        toFacet.facets.forEach(f=> buildMultiFacet(addFacet,f));
    }
    if('name' in toFacet && 'attribute' in toFacet){
        if(Array.isArray(toFacet.facets)) {
            toFacet.facets.unshift(addFacet);
        } else {
            toFacet.facets = [addFacet]
        }
    }
}