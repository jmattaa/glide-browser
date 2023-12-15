

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
        this.lastPages.push(this.currentPage);

        // check if this page is next in list
        if (this.lastPages[this.currentPageIdx + 1] == page) {
            this.currentPage = page;
            return;
        }
        // if not remove everything after
        this.lastPages.splice(
            this.currentPageIdx,
            this.lastPages.length - this.currentPageIdx
        );

        this.currentPageIdx++;
        this.currentPage = page;
    }

    public goBack() {
        this.currentPageIdx--;
        this.currentPage = this.lastPages[this.lastPages.length - 1];
        return this.currentPage;
    }

    public goForward() {
        if (this.lastPages[this.currentPageIdx + 1]) {
            this.currentPage = this.lastPages[this.lastPages.length + 1];
            return this.currentPage;
        }

        return this.currentPage;
    }
}
