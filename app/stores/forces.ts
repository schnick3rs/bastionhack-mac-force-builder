import {defineStore} from "pinia";
import type {Auxiliary, Entry, Force, Formation, MAC, RemoteAsset, WeaponProfile,} from "~~/types/unit";
import {parseWeaponString} from "#shared/utils/weapons";
import {sortForceEntries} from "#shared/utils/forces";

import { uniqueUsernameGenerator as gen, nouns } from 'unique-username-generator';
import {id} from "#ui/locale";

const militaryAdjectives = [
    'Armoured',
    'Battle',
    'Heavy',
    'Subsonic',
    'Supersonic',
    'Stealth',
    'Siege',
    'Mobile',
    'Tactical',
    'Rapid',
    'Experimental',
    'Plasma',
    'Laser',
    'Cyber',
    'Storm',
    'Shadow',
    'Iron',
    'Steel',
    'Phantom',
    'Vortex',
]

const vehicleNouns = [
    'Tank',
    'Transporter',
    'Crawler',
    'Fighter',
    'Bomber',
    'Carrier',
    'Destroyer',
    'Interceptor',
    'Gunship',
    'Drone',
    'Frigate',
    'Speeder',
    'Juggernaut',
    'Harvester',
    'Striker',
    'Marauder',
    'Sentinel',
    'Dreadnought',
]

// Infantry Name Generator Parts

const infantryDescriptors = [
    "Laser",
    "Plasma",
    "Thermal",
    "Jet",
    "Ghost",
    "Shadow",
    "Storm",
    "Iron",
    "Steel",
    "Flame",
    "Night",
    "Crimson",
    "Phantom",
    "Shock",
    "Venom",
    "Cyber",
    "Stormborn",
    "Toxic",
    "Warborn",
    "Frost"
];

const unitTypes = [
    "Squad",
    "Team",
    "Sappers",
    "Grenadiers",
    "Marines",
    "Assassins",
    "Hunters",
    "Raiders",
    "Rangers",
    "Commandos",
    "Troopers",
    "Scouts",
    "Blades",
    "Gunners",
    "Saboteurs",
    "Snipers",
    "Skirmishers",
    "Enforcers",
    "Operators",
    "Legion"
];


export const useForcesStore = defineStore('forcesStore', {
    state: () => ({
        version: 1, // defines if the store must be migrated OR depleted
        forces: [] as Force[],
        hydrated: false,
        isHydrating: true, // Start as true since hydration happens immediately
    }),

    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        afterHydrate: (ctx) => {
            console.info('Store afterHydrate triggered')
            ctx.store.hydrated = true;
            ctx.store.isHydrating = false;
        },
    },

    getters: {

        allForces(state) {
            return state.forces;
        },

        forceById(state) {
          return (id: string): Force | undefined => state.forces.find((force) => force.id === id);
        },

        getEntry(state) {
            return (forceId: string, entryId: string): Entry | undefined => state.forces.find((force) => force.id === forceId)?.entries.find(
                (entry) => entry.id === entryId
            )
        }

    },

    actions: {

        // Optional: manual check if you need to verify hydration
        ensureHydrated() {
            return this.hydrated;
        },

        touchForce(forceId: string) {
            const force = this.forceById(forceId);
            if (force) {
                if (!force.createdAt) {
                    force.createdAt = Date.now()
                }
                force.updatedAt = Date.now();
            }
        },

        async createNewForceList(options: any) {
            const force = {
                id: `force-${crypto.randomUUID()}`,
                name: options.name,
                pointLimit: options.pointLimit,
                entries: [],
                faction: options.factionKey || undefined,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                mods: options.mods,
            }
            this.forces.push(force);
            return force;
        },

        deleteForce(forceId: string) {
            const index = this.forces.findIndex((force: Force) => force.id === forceId);
            this.forces.splice(index, 1);
        },

        addNewEntry(forceId: string, variant: string, template?: any) {
            let force = this.forces.find((force) => force.id === forceId);
            if (!force) return; // ✅ safety

            let id = crypto.randomUUID();

            switch (variant) {

                case 'MAC':
                    const mac: MAC = {
                        id: id,
                        name: `The ${gen({dictionaries: [nouns], style: 'capital'})}`,
                        classification: 'MAC',
                        class: 2,
                        modules: [
                            { slot: 1, type: 'Empty' },
                            { slot: 2, type: 'Empty' },
                            { slot: 3, type: 'Empty' },
                            { slot: 4, type: 'Empty' },
                            { slot: 5, type: 'Empty' },
                            { slot: 6, type: 'Empty' },
                        ],
                        perks: [],
                        flaws: [],
                        pilot: undefined,
                    }
                    if (force.faction === 'first-regiment') {
                        mac.modules.unshift({ slot: 0, type: 'Empty' });
                    }
                    force.entries.push(mac);
                    break;

                case 'Vehicle':
                    const vehicle: Auxiliary = {
                        classification: "Auxiliary unit",
                        name: `${gen({dictionaries: [militaryAdjectives], style: 'capital'})} ${gen({dictionaries: [vehicleNouns], style: 'capital'})}`,
                        type: 'Vehicle',
                        weapons: [],
                        hardware: [],
                    }
                    const vehicleFormation: Formation = {
                        classification: "Formation",
                        id: id,
                        size: 2,
                        unit: vehicle
                    }
                    force.entries.push(vehicleFormation);
                    break;

                case 'Infantry':
                    const infantry: Auxiliary = {
                        classification: "Auxiliary unit",
                        name: `${gen({dictionaries: [infantryDescriptors], style: 'capital'})} ${gen({dictionaries: [unitTypes], style: 'capital'})}`,
                        type: 'Infantry',
                        weapons: [],
                        hardware: [],
                    }
                    const infantryFormation: Formation = {
                        classification: "Formation",
                        id: id,
                        size: 3,
                        unit: infantry
                    }
                    force.entries.push(infantryFormation);
                    break;

                case 'Remote Asset':
                    const remoteAsset: RemoteAsset = {
                        classification: "Remote asset",
                        id: id,
                        name: template?.name || 'unidentified asset',
                        cost: template?.cost || 0,
                        effect: template?.effect || 'unknown effect',
                    }
                    force.entries.push(remoteAsset);
                    break;
            }
            force.entries = sortForceEntries(force.entries);
            this.touchForce(force.id)
            return id;
        },

        removeEntry(forceId: string, entryId: string) {
            let force = this.forces.find((force) => force.id === forceId);
            if (!force) return; // ✅ safety
            const index = force.entries.findIndex(entry => entry.id === entryId);
            force.entries.splice(index, 1);
            this.touchForce(force.id);
        },
    }
});