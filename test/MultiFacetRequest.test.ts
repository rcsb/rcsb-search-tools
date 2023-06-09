import fetch from "node-fetch";
import {
    ReturnType, Service,
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchEnums";
import {SearchClient} from "../src/SearchClient/SearchClient";
import {QueryResult} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchResultInterface";
import {SearchRequest} from "@rcsb/rcsb-api-tools/build/RcsbSearch/SearchRequest";
import {
    EXPL_METHOD_FACET,
    RELEASE_DATE
} from "./Utils/TestData";
import {buildMultiFacet, buildRequestFromAttribute} from "../src/SearchQueryTools/SearchQueryTools";
import {RcsbSearchMetadata} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchMetadata";
import {getFacetsFromSearch} from "../src/SearchParseTools/SearchFacetTools";
import {expectDefined} from "./Utils/TestUtils";
import {AttributeFacetType, FilterFacetType} from "../src/SearchParseTools/SearchFacetInterface";
import {SearchRequestType} from "../src/SearchQueryTools/SearchQueryInterfaces";
import {cloneDeep} from "lodash";

describe('Multi faceting request testing to RCSB Search API', ()=> {
    test('Testing facet consistency: query and response facet name matching and non-empty, non-empty buckets', async ()=> {

        SearchClient.set( new SearchRequest(undefined, fetch as unknown as (input:RequestInfo, init?:RequestInit)=>Promise<Response>) );
        const multiFacet: AttributeFacetType = cloneDeep(RELEASE_DATE);
        buildMultiFacet(EXPL_METHOD_FACET, multiFacet);
        const queryFacets: [AttributeFacetType|FilterFacetType, ...(AttributeFacetType|FilterFacetType)[]] = [multiFacet];
        const query: SearchRequestType =  buildRequestFromAttribute({
                attribute: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.path,
                value: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.enum.experimental,
                operator: RcsbSearchMetadata.RcsbEntryInfo.StructureDeterminationMethodology.operator.ExactMatch,
                service: Service.Text
            },
            ReturnType.Entry,{
                facets: queryFacets
            }
        )
        const response: QueryResult | null = await SearchClient.get().request(query);
        expectDefined(response);
        expect(response.result_type).toBe(ReturnType.Entry);
        expect(response.total_count).toBeGreaterThan(200000);
        expect(response.facets?.length).toBe(1);

        const facets = getFacetsFromSearch(response);
        expect(facets.filter(f=>f.name == RELEASE_DATE.name).length).toBeGreaterThan(0);
        expect(facets.filter(f=>f.name == EXPL_METHOD_FACET.name).length).toBeGreaterThan(0);
        facets.forEach(f=>{
            expect([RELEASE_DATE.name, EXPL_METHOD_FACET.name]).toContainEqual(f.name);
            if(f.name == EXPL_METHOD_FACET.name)
                expect(f.labelPath.length).toBe(1);
            else if(f.name == EXPL_METHOD_FACET.name)
                expect(f.labelPath.length).toBe(0);
            f.data.forEach(d=>{
                expect(d.label).toBeDefined();
                expect(d.population).toBeGreaterThan(0);
            })
        });

    });
});
