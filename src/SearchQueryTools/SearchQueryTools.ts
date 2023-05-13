import {
    GroupNode, RequestOptions,  SearchQuery,
    TerminalNode
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";
import {
    LogicalOperator,
    Type,
    ReturnType
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {cloneDeep} from "lodash";
import {SearchAttributeInterface} from "./SearchQueryInterfaces";

export type SearchQueryType = GroupNode | TerminalNode;
export type SearchRequestType = SearchQuery;


export function buildRequestFromAttribute(
    searchAttribute: SearchAttributeInterface,
    returnType: ReturnType,
    requestOptions?: RequestOptions
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
    requestOptions?: RequestOptions
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
    requestOptions?: RequestOptions
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
    requestOptions?: RequestOptions
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