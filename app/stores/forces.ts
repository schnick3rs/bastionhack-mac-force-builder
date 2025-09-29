import {defineStore} from "pinia";

export const useForcesStore = defineStore('forcesStore', {
    state: () => ({

        /** @type { id: string, name: string, pointLimit: number, units: any[]} */
        forces: [],

    }),

    persist: true,

    getters: {

        allForces(state) {
            return state.forces;
        },

        forceById(state) {
          return (id: string) => state.forces.find((force) => force.id === id);
        },

    },

    actions: {
        async createNewForceList(options) {
            const force = {
                id: options.id,
                name: options.name,
                pointLimit: options.pointLimit,
                units: [],
            }
            this.forces.push(force);
        },

        addNewUnit(forceId, options) {
            let force = this.forces.find((force) => force.id === forceId);
            if (!force) return; // ✅ safety
            force.units.push({id: crypto.randomUUID(), ...options});
        }
    }
});