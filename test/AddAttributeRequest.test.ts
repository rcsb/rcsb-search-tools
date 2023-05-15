import fetch from "node-fetch";
import {ReturnType, Service,} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {SearchClient} from "../src/SearchClient/SearchClient";
import {QueryResult} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchResultInterface";
import {SearchRequest} from "@rcsb/rcsb-api-tools/build/RcsbSearch/SearchRequest";
import {
    buildAttributeQuery,
    buildRequestFromAttributeAndSearchQuery
} from "../src/SearchQueryTools/SearchQueryTools";
import {RcsbSearchMetadata} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {expectDefined} from "./Utils/TestUtils";
import {SearchRequestType, SearchQueryType} from "../src/SearchQueryTools/SearchQueryInterfaces";
describe('Testing attribute addition to search request', ()=> {
    test('Response should not be empty, Entry type and result count gt 60000', async ()=> {

        SearchClient.set( new SearchRequest(undefined, fetch as unknown as (input:RequestInfo, init?:RequestInit)=>Promise<Response>) );
        const searchQuery: SearchQueryType = buildAttributeQuery({
            attribute: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.path,
            value: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.enum.experimental,
            operator: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.operator.ExactMatch,
            service: Service.Text
        });
        const query: SearchRequestType =  buildRequestFromAttributeAndSearchQuery({
                attribute: RcsbSearchMetadata.RcsbEntitySourceOrganism.NcbiScientificName.path,
                value: "Homo sapiens",
                operator:  RcsbSearchMetadata.RcsbEntitySourceOrganism.NcbiScientificName.operator.ExactMatch,
                service: Service.Text
            },
            searchQuery,
            ReturnType.Entry
        );
        const response: QueryResult | null = await SearchClient.get().request(query);
        expectDefined(response);
        expect(response.result_type).toBe(ReturnType.Entry);
        expect(response.total_count).toBeGreaterThan(60000);

    });
});
