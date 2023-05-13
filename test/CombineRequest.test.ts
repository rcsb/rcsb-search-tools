import fetch from "node-fetch";
import {SearchQuery} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchQueryInterface";
import {
    ReturnType, SequenceType, Service, Type,
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {SearchClient} from "../src/SearchClient/SearchClient";
import {QueryResult} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchResultInterface";
import {SearchRequest} from "@rcsb/rcsb-api-tools/build/RcsbSearch/SearchRequest";
import {
    buildAttributeQuery,
     buildRequestFromCombinedSearchQuery,
    SearchQueryType
} from "../src/SearchQueryTools/SearchQueryTools";
import {RcsbSearchMetadata} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {expectDefined} from "./Utils/TestUtils";

describe('Combining search queries test', ()=> {
    test('Response should not be empty, type polymer_entity and result count gt 1000', async ()=> {

        SearchClient.set( new SearchRequest(undefined, fetch as unknown as (input:RequestInfo, init?:RequestInit)=>Promise<Response>) );
        const attributeQuery: SearchQueryType =  buildAttributeQuery({
                attribute: RcsbSearchMetadata.RcsbEntitySourceOrganism.NcbiScientificName.path,
                value: "Homo sapiens",
                operator:  RcsbSearchMetadata.RcsbEntitySourceOrganism.NcbiScientificName.operator.ExactMatch,
                service: Service.Text
            }
        );
        const sequenceQuery: SearchQueryType = {
            type: Type.Terminal,
            service: Service.Sequence,
            parameters: {
                evalue_cutoff: 0.1,
                identity_cutoff: 0,
                sequence_type: SequenceType.Protein,
                value: "MTEYKLVVVGAVGVGKSALTIQLIQNHFVDEYDPTIEDSYRKQVVIDGETCLLDILDTAGQEEYSAMRDQYMRTGEGFLCVFAINNTKSFEDIHQYREQIKRVKDSDDVPMVLVGNKCDLAARTVESRQAQDLARSYGIPYIETSAKTRQGVEDAFYTLVREIRQH"
            }
        };
        const query: SearchQuery = buildRequestFromCombinedSearchQuery(
            sequenceQuery,
            attributeQuery,
            ReturnType.PolymerEntity
        );
        const response: QueryResult | null = await SearchClient.get().request(query);
        expectDefined(response);
        expect(response.result_type).toBe(ReturnType.PolymerEntity);
        expect(response.total_count).toBeGreaterThan(1000);

    });
});
