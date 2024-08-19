import {SearchBucketFacetType} from "./SearchFacetInterface";
import {
    BucketFacet, QueryResult,
    SingleValueMetricsFacet
} from "@rcsb/rcsb-api-tools/build/RcsbSearch/Types/SearchResultInterface";

export function getFacetsFromSearch(
    searchResult: QueryResult
): SearchBucketFacetType[]{
    if(!searchResult.facets)
        return [];
    return getBucketsFromFacets(searchResult.facets)
}

export function getBucketsFromFacets(
    searchResultFacets: (BucketFacet | SingleValueMetricsFacet)[],
    labelList?: string[],
    recursiveOut?: SearchBucketFacetType[]
): SearchBucketFacetType[] {
    const out: SearchBucketFacetType[] = recursiveOut ?? [];
    const facets = collectFacets(searchResultFacets);
    facets.forEach(bucketFacet=> {
        const innerFacets = bucketFacet.buckets?.filter(g=> Array.isArray(g.facets) ) ?? [];
        if(innerFacets.length > 0){
            innerFacets.forEach(g=>{
                if(g.facets) getBucketsFromFacets(g.facets, labelList ? labelList.concat(g.label) : [g.label], out);
            });
        }
        const searchBucketFacet: SearchBucketFacetType = {
            name: bucketFacet.name,
            labelPath: labelList ?? [],
            data: []
        };
        bucketFacet.buckets?.forEach(bucket=>{
            if(bucket.label && bucket.population)
                searchBucketFacet.data.push({
                    label: bucket.label,
                    population: bucket.population
                });
        })
        out.push(searchBucketFacet);
    });
    return out;
}

function collectFacets(facets: (BucketFacet | SingleValueMetricsFacet)[]): BucketFacet[] {
    return facets.map(f=>( 'value' in f ? {
        name: f.name,
        buckets:[{
            label: f.name,
            population: f.value
        }]
    } : f));
}