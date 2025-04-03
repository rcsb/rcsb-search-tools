import fetch from "node-fetch";
import {
    ReturnType, Service,
} from "@rcsb/rcsb-api-tools/lib/RcsbSearch/Types/SearchEnums";
import {SearchClient} from "../src/SearchClient/SearchClient";
import {QueryResult} from "@rcsb/rcsb-api-tools/lib/RcsbSearch/Types/SearchResultInterface";
import {SearchRequest} from "@rcsb/rcsb-api-tools/lib/RcsbSearch/SearchRequest";
import {buildRequestFromAttribute} from "../src/SearchQueryTools/SearchQueryTools";
import {RcsbSearchMetadata} from "@rcsb/rcsb-api-tools/lib/RcsbSearch/Types/SearchMetadata";
import {expectDefined} from "./Utils/TestUtils";
import {SearchRequestType} from "../src/SearchQueryTools/SearchQueryInterfaces";
describe('Single request testing to RCSB Search API', ()=> {
    test('Response should be non empty, Entry type and total count gt 200000', async ()=> {

        SearchClient.set( new SearchRequest(undefined, fetch as unknown as (input:RequestInfo, init?:RequestInit)=>Promise<Response>) );
        const query: SearchRequestType =  buildRequestFromAttribute({
                attribute: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.path,
                value: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.enum.experimental,
                operator: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.operator.ExactMatch,
                service: Service.Text
            },
            ReturnType.Entry
        );
        const response: QueryResult | null = await SearchClient.get().request(query);
        expectDefined(response);
        expect(response.result_type).toBe(ReturnType.Entry);
        expect(response.total_count).toBeGreaterThan(200000);

    });
});
