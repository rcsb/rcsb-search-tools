import {AggregationType, SequenceType, Service, Type} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {RcsbSearchMetadata} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {buildAttributeQuery, SearchQueryType} from "../../src/SearchQueryTools/SearchQueryTools";
import {FacetAttributeType} from "../../src/SearchParseTools/SearchFacetInterface";

export const FULL_ARCHIVE_QUERY: SearchQueryType = buildAttributeQuery({
    attribute: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.path,
    value: "experimental",
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
        value: "MVLSEGEWQLVLHVWAKVEADVAGHGQDILIRLFKSHPETLEKFDRVKHLKTEAEMKASEDLKKHGVTVLTALGAILKKKGHHEAELKPLAQSHATKHKIPIKYLEFISEAIIHVLHSRHPGNFGADAQGAMNKALELFRKDIAAKYKELGYQG"
    }
};

export const EXPL_METHOD_FACET: FacetAttributeType = {
    name: `FACET/${RcsbSearchMetadata.Exptl.Method.path}`,
    aggregation_type: AggregationType.Terms,
    attribute: RcsbSearchMetadata.Exptl.Method.path
};

export const PRIMARY_CITATION_FACET: FacetAttributeType =  {
    name: `FACET/${RcsbSearchMetadata.RcsbPrimaryCitation.RcsbJournalAbbrev.path}`,
    aggregation_type: AggregationType.Terms,
    attribute: RcsbSearchMetadata.RcsbPrimaryCitation.RcsbJournalAbbrev.path
};

export const RESOLUTION_FACET: FacetAttributeType = {
    name: `FACET/${RcsbSearchMetadata.RcsbEntryInfo.DiffrnResolutionHigh.Value.path}`,
    aggregation_type: AggregationType.Histogram,
    attribute: RcsbSearchMetadata.RcsbEntryInfo.DiffrnResolutionHigh.Value.path,
    interval: 0.5,
    min_interval_population: 1
};