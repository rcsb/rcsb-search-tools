import {
    CardinalityFacet,
    DateHistogramFacet, DateRangeFacet, FilterFacet, FilterQueryGroupNode, FilterQueryTerminalNode,
    HistogramFacet, RangeFacet,
    TermsFacet,
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";
import {RcsbSearchAttributeType} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";

type TermsFacetType = Omit<TermsFacet, "attribute" | "facets"> & {
    attribute: RcsbSearchAttributeType;
    facets?: [(AttributeFacetType | FilterFacetType), ...(AttributeFacetType | FilterFacetType)[]];
};

type HistogramFacetType = Omit<HistogramFacet, "attribute" | "facets"> & {
    attribute: RcsbSearchAttributeType;
    facets?: [(AttributeFacetType | FilterFacetType), ...(AttributeFacetType | FilterFacetType)[]];
};

type DateHistogramFacetType = Omit<DateHistogramFacet, "attribute" | "facets"> & {
    attribute: RcsbSearchAttributeType;
    facets?: [(AttributeFacetType | FilterFacetType), ...(AttributeFacetType | FilterFacetType)[]];
};

type RangeFacetType = Omit<RangeFacet, "attribute" | "facets"> & {
    attribute: RcsbSearchAttributeType;
    facets?: [(AttributeFacetType | FilterFacetType), ...(AttributeFacetType | FilterFacetType)[]];
};

type DateRangeFacetType = Omit<DateRangeFacet, "attribute" | "facets"> & {
    attribute: RcsbSearchAttributeType;
    facets?: [(AttributeFacetType | FilterFacetType), ...(AttributeFacetType | FilterFacetType)[]];
};

type CardinalityFacetType = Omit<CardinalityFacet, "attribute" | "facets"> & {
    attribute: RcsbSearchAttributeType;
    facets?: [(AttributeFacetType | FilterFacetType), ...(AttributeFacetType | FilterFacetType)[]];
};

export type AttributeFacetType = TermsFacetType | HistogramFacetType | DateHistogramFacetType | RangeFacetType | DateRangeFacetType | CardinalityFacetType;

export type FilterQueryTerminalNodeType = Omit<FilterQueryTerminalNode, "parameters"> & {
    parameters: Omit<FilterQueryTerminalNode["parameters"], "attribute"> & {
        attribute: RcsbSearchAttributeType;
    }
};

export type FilterQueryGroupNodeType = Omit<FilterQueryGroupNode, "nodes"> & {
    nodes: [FilterQueryTerminalNodeType | FilterQueryGroupNodeType, ...(FilterQueryTerminalNodeType | FilterQueryGroupNodeType)[]];
};

// TODO I am not able to Omit filter but it should be possible
export type FilterFacetType = Omit<FilterFacet, "facets" > & {
    facets: [AttributeFacetType | FilterFacetType, ...(AttributeFacetType | FilterFacetType)[]];
    filter: FilterQueryGroupNodeType | FilterQueryTerminalNodeType ;
};

export type BucketDataType = {
    label: string | number;
    population: number;
}

export type SearchBucketFacetType = {
    name: string;
    data: BucketDataType[];
    labelPath: string[],
}