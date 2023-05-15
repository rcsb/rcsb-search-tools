import fetch from "node-fetch";
import {
    ReturnType, Service,
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {SearchClient} from "../src/SearchClient/SearchClient";
import {QueryResult} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchResultInterface";
import {SearchRequest} from "@rcsb/rcsb-api-tools/build/RcsbSearch/SearchRequest";
import {CATH_FACET} from "./Utils/TestData";
import {buildRequestFromAttribute} from "../src/SearchQueryTools/SearchQueryTools";
import {RcsbSearchMetadata} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {getFacetsFromSearch} from "../src/SearchParseTools/SearchFacetTools";
import {expectDefined} from "./Utils/TestUtils";
import {FilterFacetType} from "../src/SearchParseTools/SearchFacetInterface";
import {SearchRequestType} from "../src/SearchQueryTools/SearchQueryInterfaces";
describe('Facet request testing to RCSB Search API', ()=> {
    test('Testing facet consistency: query and response facet name matching and non-empty', async ()=> {

        SearchClient.set( new SearchRequest(undefined, fetch as unknown as (input:RequestInfo, init?:RequestInit)=>Promise<Response>) );
        const queryFacets: [FilterFacetType] = [CATH_FACET];
        const query: SearchRequestType =  buildRequestFromAttribute({
                attribute: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.path,
                value: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.enum.experimental,
                operator: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.operator.ExactMatch,
                service: Service.Text
            },
            ReturnType.Entry,{
                facets: queryFacets
            }
        );
        const response: QueryResult | null = await SearchClient.get().request(query);
        expectDefined(response);
        expect(response.result_type).toBe(ReturnType.Entry);
        expect(response.total_count).toBeGreaterThan(200000);
        expect(response.facets?.length).toBe(1);
        const facets = getFacetsFromSearch(response);
        expect(facets.length).toBe(1);
        expect(facets[0].data.length).toBeGreaterThan(2300);
        facets[0].data.forEach(d=>{
            expect(d.population).toBeGreaterThan(0);
            expect(d.label).toBeDefined();
        })
    });
});
