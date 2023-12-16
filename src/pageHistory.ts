

export class PageHistory {
    public lastPages: Array<string>;

    private currentPage: string;
    private currentPageIdx: number;

    constructor(currentPage: string) {
        this.lastPages = [];
        this.currentPage = currentPage;
        this.currentPageIdx = 0;
    }

    public newPage(page: string) {
        // why tf are people redirecting to themselfs
        // or are they?? idk but this works
        if (this.currentPage == page)
            return;

        // check if this page is next in list
        if (this.lastPages[this.currentPageIdx + 1] == page) {
            this.currentPage = page;
            this.currentPageIdx++;
            return;
        }
        // remove everything after if we not on last page
        if (this.lastPages[this.currentPageIdx + 1])
            this.lastPages.splice(
                this.currentPageIdx + 1,
                this.lastPages.length - this.currentPageIdx + 1
            );

        this.currentPage = page;
        this.lastPages.push(this.currentPage);
        this.currentPageIdx = this.lastPages.length - 1;

        console.log(this);
    }

    public goBack() {
        this.currentPageIdx--;
        if (this.currentPageIdx < 0) this.currentPageIdx = 0;
        this.currentPage = this.lastPages[this.currentPageIdx];
        console.log(this);
        return this.currentPage;
    }

    public goForward() {
        if (this.lastPages[this.currentPageIdx + 1]) {
            this.currentPage = this.lastPages[this.currentPageIdx + 1];
            this.currentPageIdx++;
            console.log(this);
            return this.currentPage;
        }

        console.log(this);
        return this.currentPage;
    }
}
