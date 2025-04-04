import {SearchBucketFacetType} from "./SearchFacetInterface";
import {
    BucketFacet, QueryResult,
    SingleValueMetricsFacet
} from "@rcsb/rcsb-api-tools/lib/RcsbSearch/Types/SearchResultInterface";

export function getFacetsFromSearch(
    searchResult: QueryResult
): SearchBucketFacetType[]{
    if(!searchResult.facets)
        return [];
    return mergeBucketsByName(recursiveBucketsFromFacets(searchResult.facets))
}

export function getBucketsFromFacets(
    searchResultFacets: (BucketFacet | SingleValueMetricsFacet)[]
): SearchBucketFacetType[] {
    return mergeBucketsByName(recursiveBucketsFromFacets(
        searchResultFacets
    ))
}

function recursiveBucketsFromFacets(
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
                if(g.facets) recursiveBucketsFromFacets(g.facets, labelList ? labelList.concat(g.label) : [g.label], out);
            });
        } else {
            const searchBucketFacet: SearchBucketFacetType = {
                name: bucketFacet.name,
                data: []
            };
            bucketFacet.buckets?.forEach(bucket => {
                if (bucket.label && bucket.population)
                    searchBucketFacet.data.push({
                        label: bucket.label,
                        population: bucket.population,
                        labelPath: [...(labelList ?? []), bucket.label]
                    });
            })
            out.push(searchBucketFacet);
        }
    });
    return out;
}

function mergeBucketsByName(buckets: SearchBucketFacetType[]): SearchBucketFacetType[]{
    return Array.from(buckets.reduce((mapMerge, current)=>{
        if(mapMerge.has(current.name))
            mapMerge.get(current.name)?.data.push(...current.data)
        else
            mapMerge.set(current.name, current)
        return mapMerge;
    }, new Map<string,SearchBucketFacetType>()).values());
}

function collectFacets(facets: (BucketFacet | SingleValueMetricsFacet)[]): BucketFacet[] {
    return facets.filter(f=> 'value' in f || ('buckets' in f && f.buckets.length > 0)).map(f=>( 'value' in f ? {
        name: f.name,
        buckets:[{
            label: f.name,
            population: f.value
        }]
    } : f));
}
