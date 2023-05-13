import {
    CardinalityFacet,
    DateHistogramFacet, DateRangeFacet, FilterFacet,
    HistogramFacet, RangeFacet,
    TermsFacet,
    AttributeTextQueryParameters
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";
import {RcsbSearchAttributeType} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {Service} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";

export type FacetAttributeType = TermsFacet | HistogramFacet | DateHistogramFacet | RangeFacet | DateRangeFacet | CardinalityFacet;

export type BucketDataType = {
    label: string | number;
    population: number;
}

export type SearchBucketFacetType = {
    name: string;
    data: BucketDataType[];
    labelPath: string[],
}