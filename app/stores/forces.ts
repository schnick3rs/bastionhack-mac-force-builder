import {defineStore} from "pinia";
import type {Auxiliary, Entry, Force, Formation, HardwareProfile, MAC, WeaponProfile,} from "~~/types/unit";
import {parseWeaponString} from "#shared/utils/weapons";
import {sortForceEntries} from "#shared/utils/forces";

import { uniqueUsernameGenerator as gen, adjectives, nouns } from 'unique-username-generator';


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

        getEntry(state) {
            return (forceId: string, entryId: string): Entry | undefined => state.forces.find((force) => force.id === forceId)?.entries.find(
                (entry) => entry.id === entryId
            )
        }

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
                        name: `The ${gen({dictionaries: [nouns]})}`,
                        classification: 'MAC',
                        class: 2,
                        modules: [
                            { slot: 1, type: 'Weapon', double: false, profile: parseWeaponString('SP2 IonBeam') as WeaponProfile },
                            { slot: 2, type: 'Weapon', double: false, profile: parseWeaponString('SP2-XJ IonBeam') as WeaponProfile },
                            { slot: 3, type: 'Weapon', double: false, profile: parseWeaponString('P2 Piston') as WeaponProfile },
                            { slot: 4, type: 'Hardware', double: false, profile: { name: 'Radiator' } },
                            { slot: 5, type: 'Hardware', double: false, profile: { name: 'Radiator' } },
                            { slot: 6, type: 'Hardware', double: false, profile: { name: 'Radiator' } },
                        ]
                    }
                    force.entries.push(mac);
                    break;

                case 'Vehicle':
                    const vehicle: Auxiliary = {
                        classification: "Auxiliary unit",
                        name: `${gen({dictionaries: [['Battle', 'Combat', 'Strike']]})} ${gen({dictionaries: [['Tank', 'Transporter', 'Fighter']]})}`,
                        type: 'Vehicle',
                        modules: [
                            { type: 'Weapon', profile: parseWeaponString('LP2 RailCannon') as WeaponProfile },
                            { type: 'Hardware', profile: { name: 'Armour' } },
                        ]
                    }
                    const vehicleFormation: Formation = {
                        classification: "Formation",
                        id: crypto.randomUUID(),
                        size: 3,
                        unit: vehicle
                    }
                    force.entries.push(vehicleFormation);
                    break;

                case 'Infantry':
                    const infantry: Auxiliary = {
                        classification: "Auxiliary unit",
                        name: `${gen({dictionaries: [['Laser', 'Sniper', 'Stalker']]})} ${gen({dictionaries: [['Group', 'Squad', 'Team', 'Gang']]})}`,
                        type: 'Infantry',
                        modules: [
                            { type: 'Weapon', profile: parseWeaponString('SP1 LaserRifles') as WeaponProfile },
                        ]
                    }
                    const infantryFormation: Formation = {
                        classification: "Formation",
                        id: crypto.randomUUID(),
                        size: 4,
                        unit: infantry
                    }
                    force.entries.push(infantryFormation);
                    break;
            }
            force.entries = sortForceEntries(force.entries);

        }
    }
});