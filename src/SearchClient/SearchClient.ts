import {SearchRequest} from "@rcsb/rcsb-api-tools/build/RcsbSearch/SearchRequest";

export class SearchClient {

    private static client: SearchRequest = new SearchRequest();

    public static get(): SearchRequest {
        return this.client;
    }

    public static set(client: SearchRequest): void {
        this.client = client;
    }

}
