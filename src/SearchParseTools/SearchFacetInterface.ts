import {
    CardinalityFacet,
    DateHistogramFacet, DateRangeFacet,
    HistogramFacet, RangeFacet,
    TermsFacet,
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";

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