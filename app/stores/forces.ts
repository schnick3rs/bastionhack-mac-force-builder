import {defineStore} from "pinia";
import type {Auxiliary, Entry, Force, Formation, MAC, WeaponProfile,} from "~~/types/unit";
import {parseWeaponString} from "#shared/utils/weapons";
import {sortForceEntries} from "#shared/utils/forces";

import { uniqueUsernameGenerator as gen, nouns } from 'unique-username-generator';

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

    }),

    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    },

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
                faction: options.factionKey || undefined,
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
                        name: `The ${gen({dictionaries: [nouns], style: 'capital'})}`,
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
                    if (force.faction === 'first-regiment') {
                        mac.modules.unshift({ slot: 0, type: 'Weapon', double: false, profile: parseWeaponString('SP2 IonBeam') as WeaponProfile });
                    }
                    force.entries.push(mac);
                    break;

                case 'Vehicle':
                    const vehicle: Auxiliary = {
                        classification: "Auxiliary unit",
                        name: `${gen({dictionaries: [militaryAdjectives], style: 'capital'})} ${gen({dictionaries: [vehicleNouns], style: 'capital'})}`,
                        type: 'Vehicle',
                        weapons: [parseWeaponString('LP2 RailCannon') as WeaponProfile],
                        hardware: [{ name: 'Armour' }],
                    }
                    const vehicleFormation: Formation = {
                        classification: "Formation",
                        id: crypto.randomUUID(),
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
                        weapons: [parseWeaponString('SP1 LaserRifles') as WeaponProfile],
                        hardware: [{ name: 'Transport' }],
                    }
                    const infantryFormation: Formation = {
                        classification: "Formation",
                        id: crypto.randomUUID(),
                        size: 3,
                        unit: infantry
                    }
                    force.entries.push(infantryFormation);
                    break;
            }
            force.entries = sortForceEntries(force.entries);

        },

        removeEntry(forceId: string, entryId: string) {
            let force = this.forces.find((force) => force.id === forceId);
            if (!force) return; // ✅ safety
            const index = force.entries.findIndex(entry => entry.id === entryId);
            force.entries.splice(index, 1);
        },
    }
});