import {defineStore} from "pinia";

export const useForcesStore = defineStore('forcesStore', {
    state: () => ({
        id: null,
        name: '',
        pointLimit: 0,
        units: [],
    }),

    persist: true,

    actions: {
        async createNewForceList(options) {
            this.id = options.id;
            this.name = options.name;
            this.pointLimit = options.pointLimit;
        }
    }
});