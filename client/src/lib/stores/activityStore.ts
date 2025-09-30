import { makeAutoObservable } from "mobx";

export class ActivityStore {
    filter = 'all';
    startDate = new Date().toISOString();

    constructor() {
        makeAutoObservable(this)
    }

    setFiler = (filter: string) => {
        this.filter = filter;
    }

    setStartDate = (date: Date) => {
        this.startDate = date.toISOString();
    }
}