import {Force, type VariantRule} from "~~/types/unit";

export interface VariantRuleDefinition {
    key: string;
    name: VariantRule;
    pages: string;
    hint: string;
    onAttach: Function;
    onDetach: Function;
}

const variantRuleDefinition: VariantRuleDefinition[] = [];

export const create = (
    name: VariantRule,
    pages: string,
    hint: string,
    onAttach: Function,
    onDetach: Function,
): VariantRuleDefinition => {
    return {
        key: name.toLowerCase().replace(/\s+/g, '-'), // example slug
        name,
        pages,
        hint,
        onAttach,
        onDetach,
    }
}

variantRuleDefinition.push(
    create(
        'Double Modules',
        '49',
        'Each MAC can have two modules.',
        (force: Force) => {
            //, nothing to do here
        },
        (force: Force) => {
            // set all double modules of MACs to false
            force.entries
                .filter(e => e.classification === 'MAC')
                .forEach(entry => {
                    entry.modules
                        .filter(module => module.type !== 'Empty')
                        .forEach(module => module.double = false)
                })
        }),
    create(
        'Perks & Flaws',
        '52-53',
        'Give some MACs a perk and/or flaw.',
        (force: Force) => {
            //, nothing to do here
        },
        (force: Force) => {
            // rpurge all perks and flaws from MACs
            force.entries
                .filter(e => e.classification === 'MAC')
                .forEach(entry => {
                    entry.perks = [];
                    entry.flaws = [];
                })
        }),
    create(
        'Remote Assets',
        '54-55',
        'Add one use assets to your force',
        (force: Force) => {
            //, nothing to do here
        },
        (force: Force) => {
            // purge all assets from the list
            const assetIds = force.entries.filter(e => e.classification === 'Remote asset').map(asset => asset.id)
            assetIds.forEach(id => {
                const index = force.entries.findIndex(entry => entry.id === id);
                force.entries.splice(index, 1);
            })
        }),
    create(
        'Pilot Tricks',
        '57',
        'Enlist Ace and Rookie Pilots',
        (force: Force) => {
            //, nothing to do here
        },
        (force: Force) => {
            // purge all assets from the list
            force.entries
                .filter(e => e.classification === 'MAC')
                .forEach(entry => {
                    entry.pilot = undefined;
                })
        }),
    create(
        'Command Drills',
        '57',
        'Decide for a one use ability of your commander',
        (force: Force) => {
            //, nothing to do here
        },
        (force: Force) => {
            // purge all assets from the list
            force.commandDrill = undefined;
        }),
);

export default variantRuleDefinition;