import {RcsbSearchAttributeType} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {
    AttributeTextQueryParameters,
    RequestOptions
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";
import {
    RelevanceScoreRankingOption,
    ScoringStrategy,
    Service, SortDirection
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";

export interface SearchAttributeInterface {
    attribute: RcsbSearchAttributeType;
    value: AttributeTextQueryParameters['value'];
    operator: AttributeTextQueryParameters["operator"];
    service: Service.Text | Service.TextChem;
    negation?: boolean;
}