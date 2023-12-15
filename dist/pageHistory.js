"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageHistory = void 0;
class PageHistory {
    constructor(currentPage) {
        this.lastPages = [];
        this.currentPage = currentPage;
        this.currentPageIdx = 0;
    }
    newPage(page) {
        this.lastPages.push(this.currentPage);
        // check if this page is next in list
        if (this.lastPages[this.currentPageIdx + 1] == page) {
            this.currentPage = page;
            return;
        }
        // if not remove everything after
        this.lastPages.splice(this.currentPageIdx, this.lastPages.length - this.currentPageIdx);
        this.currentPageIdx++;
        this.currentPage = page;
    }
    goBack() {
        this.currentPageIdx--;
        this.currentPage = this.lastPages[this.lastPages.length - 1];
        return this.currentPage;
    }
    goForward() {
        if (this.lastPages[this.currentPageIdx + 1]) {
            this.currentPage = this.lastPages[this.lastPages.length + 1];
            return this.currentPage;
        }
        return this.currentPage;
    }
}
exports.PageHistory = PageHistory;
