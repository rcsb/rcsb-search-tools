import {
    AggregationType,
    Interval,
    SequenceType,
    Service,
    Type
} from "@rcsb/rcsb-api-tools/lib/RcsbSearch/Types/SearchEnums";
import {RcsbSearchMetadata} from "@rcsb/rcsb-api-tools/lib/RcsbSearch/Types/SearchMetadata";
import {buildAttributeQuery} from "../../src/SearchQueryTools/SearchQueryTools";
import {AttributeFacetType, FilterFacetType} from "../../src/SearchParseTools/SearchFacetInterface";
import {SearchQueryType} from "../../src/SearchQueryTools/SearchQueryInterfaces";

export const FULL_ARCHIVE_QUERY: SearchQueryType = buildAttributeQuery({
    attribute: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.path,
    value: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.enum.experimental,
    operator: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.operator.ExactMatch,
    service: Service.Text
});

export const SEQUENCE_QUERY: SearchQueryType = {
    type: Type.Terminal,
    service: Service.Sequence,
    parameters: {
        evalue_cutoff: 0.1,
        identity_cutoff: 0,
        sequence_type: SequenceType.Protein,
        value: "MTEYKLVVVGAVGVGKSALTIQLIQNHFVDEYDPTIEDSYRKQVVIDGETCLLDILDTAGQEEYSAMRDQYMRTGEGFLCFAINNTKSFEDIHQYREQIKRVKDSDDVPMVLVGNKCDLAARTVESRQAQDLARSYGIPYIETSAKTRQGVEDAFYTLVREIRQH"
    }
};

export const EXPL_METHOD_FACET: AttributeFacetType = {
    name: `FACET/${RcsbSearchMetadata.Exptl.Method.path}`,
    aggregation_type: AggregationType.Terms,
    attribute: RcsbSearchMetadata.Exptl.Method.path
};

export const PRIMARY_CITATION_FACET: AttributeFacetType =  {
    name: `FACET/${RcsbSearchMetadata.RcsbPrimaryCitation.RcsbJournalAbbrev.path}`,
    aggregation_type: AggregationType.Terms,
    attribute: RcsbSearchMetadata.RcsbPrimaryCitation.RcsbJournalAbbrev.path
};

export const RESOLUTION_FACET: AttributeFacetType = {
    name: `FACET/${RcsbSearchMetadata.RcsbEntryInfo.DiffrnResolutionHigh.Value.path}`,
    aggregation_type: AggregationType.Histogram,
    attribute: RcsbSearchMetadata.RcsbEntryInfo.DiffrnResolutionHigh.Value.path,
    interval: 0.5
};

export const CATH_FACET: FilterFacetType = {
    filter: {
        type: Type.Terminal,
        service: Service.Text,
        parameters: {
            attribute: RcsbSearchMetadata.RcsbPolymerInstanceAnnotation.Type.path,
            operator: RcsbSearchMetadata.RcsbPolymerInstanceAnnotation.Type.operator.ExactMatch,
            value:  RcsbSearchMetadata.RcsbPolymerInstanceAnnotation.Type.enum.CATH
        }
    },
    facets: [{
        filter: {
            type: Type.Terminal,
            service: Service.Text,
            parameters: {
                attribute: RcsbSearchMetadata.RcsbPolymerInstanceAnnotation.AnnotationLineage.Depth.path,
                operator: RcsbSearchMetadata.RcsbPolymerInstanceAnnotation.AnnotationLineage.Depth.operator.Equals,
                value: 4
            }
        },
        facets: [{
            name: `FACET/${RcsbSearchMetadata.RcsbPolymerInstanceAnnotation.AnnotationLineage.Name.path}/${RcsbSearchMetadata.RcsbPolymerInstanceAnnotation.Type.enum.CATH}`,
            attribute: RcsbSearchMetadata.RcsbPolymerInstanceAnnotation.AnnotationLineage.Name.path,
            aggregation_type: AggregationType.Terms
        }]
    }]
}

export const RELEASE_DATE: AttributeFacetType = {
    name: `FACET/${RcsbSearchMetadata.RcsbAccessionInfo.InitialReleaseDate.path}`,
    aggregation_type: AggregationType.DateHistogram,
    attribute: RcsbSearchMetadata.RcsbAccessionInfo.InitialReleaseDate.path,
    interval: Interval.Year,
    min_interval_population: 0
};

export const GO_FUNCTION_FACET: FilterFacetType = {
    filter: {
        type: Type.Terminal,
        service: Service.Text,
        parameters: {
            operator: RcsbSearchMetadata.RcsbPolymerEntityAnnotation.Type.operator.ExactMatch,
            attribute: RcsbSearchMetadata.RcsbPolymerEntityAnnotation.Type.path,
            value: "GO"
        }
    },
    facets: [{
        name: "GO_FUNCTION_FACET",
        aggregation_type: AggregationType.Terms,
        attribute: RcsbSearchMetadata.RcsbPolymerEntityAnnotation.Name.path,
        max_num_intervals: 1000,
        min_interval_population: 1,
        facets: [{
            filter: {
                type: Type.Terminal,
                service: Service.Text,
                parameters: {
                    operator: RcsbSearchMetadata.RcsbPolymerEntityAnnotation.Type.operator.ExactMatch,
                    attribute: RcsbSearchMetadata.RcsbPolymerEntityAnnotation.AnnotationLineage.Name.path,
                    value: "molecular_function"
                }
            },
            facets: [{
                name:`GO_FUNCTION_FACET/${RcsbSearchMetadata.RcsbPolymerEntityAnnotation.AnnotationLineage.Name.path}`,
                aggregation_type: AggregationType.Terms,
                min_interval_population: 1,
                attribute: RcsbSearchMetadata.RcsbPolymerEntityAnnotation.AnnotationLineage.Name.path
            }]
        }]
    }]
}