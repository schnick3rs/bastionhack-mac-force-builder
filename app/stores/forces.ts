import {defineStore} from "pinia";
import type {Auxiliary, Entry, Force, Formation, MAC} from "~~/types/unit";

export const useForcesStore = defineStore('forcesStore', {
    state: () => ({

        forces: [] as Force[],

    }),

    persist: true,

    getters: {

        allForces(state) {
            return state.forces;
        },

        forceById(state) {
          return (id: string = ''): Force | undefined => state.forces.find((force) => force.id === id);
        },

    },

    actions: {
        async createNewForceList(options: any) {
            const force = {
                id: `force-${crypto.randomUUID()}`,
                name: options.name,
                pointLimit: options.pointLimit,
                entries: [],
            }
            this.forces.push(force);
            return force;
        },

        addNewEntry(forceId: string, variant: string) {
            let force = this.forces.find((force) => force.id === forceId);
            if (!force) return; // ✅ safety

            switch (variant) {

                case 'MAC':
                    const mac: MAC = {
                        id: crypto.randomUUID(),
                        name: 'some random MAC name',
                        classification: 'MAC',
                        class: 1,
                        modules: []
                    }
                    force.entries.push(mac);
                    break;

                case 'Vehicle':
                    const vehicle: Auxiliary = {
                        classification: "Auxiliary unit",
                        name: "Battle Tank",
                        type: 'Vehicle',
                        modules: []
                    }
                    const vehicleFormation: Formation = {
                        classification: "Formation",
                        id: crypto.randomUUID(),
                        size: 1,
                        unit: vehicle
                    }
                    force.entries.push(vehicleFormation);
                    break;

                case 'Infantry':
                    const infantry: Auxiliary = {
                        classification: "Auxiliary unit",
                        name: "Rouge Squad",
                        type: 'Infantry',
                        modules: []
                    }
                    const infantryFormation: Formation = {
                        classification: "Formation",
                        id: crypto.randomUUID(),
                        size: 1,
                        unit: infantry
                    }
                    force.entries.push(infantryFormation);
                    break;
            }

        }
    }
});