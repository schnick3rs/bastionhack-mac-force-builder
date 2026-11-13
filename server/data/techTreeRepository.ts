/**
 * Tech Tree Mode (campaign mode).
 *
 * Forces begin with limited access to units and modules. After each battle the winner chooses a tech
 * which unlocks all modules in its box. Basic techs can be chosen directly, advanced techs only if a path can
 * be drawn to them through techs the force has already unlocked (the path can move in any direction).
 */

import type {WeaponRange, WeaponSubtype, WeaponType} from "~~/types/unit";

export type TechTier = 'basic' | 'advanced'
export type UnitType = 'Infantry' | 'Vehicle'

/** The weapon properties a tech can unlock. */
export type WeaponProperty = 'range' | 'type' | 'subtype' | 'power'

/**
 * Something a force gains access to, sorted by `category`. Weapons add a second property:
 * `{ category: 'weapon', property: 'range', value: 'Short' }`.
 * `mac` and the weapon `power` hold the highest allowed value, the highest one a force has wins.
 * `restriction` limits a hardware module to one kind of auxiliary unit (e.g. vehicle armour).
 */
export type Unlock =
    | { category: 'hardware', value: string, restriction?: UnitType }
    | { category: 'mac', value: 1 | 2 | 3 }
    | { category: 'unit', value: UnitType }
    | { category: 'weapon', property: 'range', value: WeaponRange }
    | { category: 'weapon', property: 'type', value: WeaponType }
    | { category: 'weapon', property: 'subtype', value: WeaponSubtype | 'Expendable' }
    | { category: 'weapon', property: 'power', value: number }
    | { category: 'rule', value: string }

export interface Tech {
    key: string
    name: string
    tier: TechTier
    unlocks: Unlock[]
}

const hw = (...names: string[]): Unlock[] => names.map(value => ({ category: 'hardware', value }))

export const startingAccess: Unlock[] = [
    { category: 'mac', value: 1 },
    { category: 'mac', value: 2 },
    { category: 'weapon', property: 'power', value: 2 },
    { category: 'weapon', property: 'range', value: 'Short' },
    { category: 'weapon', property: 'range', value: 'Long' },
    { category: 'weapon', property: 'type', value: 'Burst' },
    { category: 'weapon', property: 'type', value: 'Piercing' },
    { category: 'weapon', property: 'subtype', value: 'Expendable' },
    ...hw('Frame', 'Plate', 'Radiator', 'Servo'),
    { category: 'unit', value: 'Infantry' },
    { category: 'unit', value: 'Vehicle' },
    { category: 'hardware', value: 'Armour', restriction: 'Vehicle' },
]

/** Readable text of an unlock, e.g. "Armour (Vehicle only)" or "Power 3 weapons". */
export function describeUnlock(u: Unlock): string {
    switch (u.category) {
        case 'hardware': return u.restriction ? `${u.value} (${u.restriction} only)` : u.value
        case 'mac': return `Class ${u.value} MACs`
        case 'unit': return `${u.value} AUs`
        case 'rule': return u.value
        case 'weapon':
            switch (u.property) {
                case 'range': return u.value === 'Brawl' ? 'Brawl weapons' : `${u.value} range`
                case 'type': return `${u.value} type`
                case 'subtype': return `${u.value} subtype`
                case 'power': return `Power ${u.value} weapons`
            }
    }
}

/** What a force has access to, merged from a list of unlocks. */
export function summarizeAccess(unlocks: Unlock[]) {
    let maxMacClass = 0
    let maxPower = 0
    const units = new Set<UnitType>()
    const ranges = new Set<WeaponRange>()
    const types = new Set<WeaponType>()
    const subtypes = new Set<string>()
    const rules = new Set<string>()
    // hardware name -> units it may be used by, null = no restriction
    const hardware = new Map<string, Set<UnitType> | null>()

    for (const u of unlocks) {
        switch (u.category) {
            case 'mac': maxMacClass = Math.max(maxMacClass, u.value); break
            case 'unit': units.add(u.value); break
            case 'rule': rules.add(u.value); break
            case 'weapon':
                if (u.property === 'power') maxPower = Math.max(maxPower, u.value)
                else if (u.property === 'range') ranges.add(u.value)
                else if (u.property === 'type') types.add(u.value)
                else subtypes.add(u.value)
                break
            case 'hardware':
                if (!u.restriction) {
                    hardware.set(u.value, null)
                } else if (hardware.get(u.value) !== null) {
                    const set = hardware.get(u.value) ?? new Set<UnitType>()
                    set.add(u.restriction)
                    hardware.set(u.value, set)
                }
                break
        }
    }

    return {
        maxMacClass,
        units: [...units],
        weapons: {
            maxPower,
            ranges: [...ranges],
            types: [...types],
            subtypes: [...subtypes],
        },
        rules: [...rules],
        // usable by both kinds of auxiliary unit is the same as no restriction
        hardware: [...hardware.entries()].map(([name, usableBy]) => ({
            name,
            usableBy: usableBy && usableBy.size < 2 ? [...usableBy] : null,
        })),
    }
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const tech = (tier: TechTier, name: string, unlocks: Unlock[]): Tech => ({ key: slug(name), name, tier, unlocks })

export const techs: Tech[] = [
    // basic tech, in the order of the book
    tech('basic', 'Thermal Osmosis', hw('Catalyst', 'Conductor', 'Emitter')),
    tech('basic', 'Hypertracking', [{ category: 'weapon', property: 'type', value: 'Multi' }, ...hw('Shield')]),
    tech('basic', 'Active Fibres', [{ category: 'weapon', property: 'range', value: 'Brawl' }, ...hw('Mesh', 'Rotor')]),
    tech('basic', 'Two-State Metals', [{ category: 'weapon', property: 'subtype', value: 'Thermal' }, ...hw('Coolant')]),
    tech('basic', 'Grav-Regulation', [{ category: 'hardware', value: 'Armour', restriction: 'Infantry' }, ...hw('Tether', 'Aerodrive')]),
    tech('basic', 'Force Expansion', [{ category: 'weapon', property: 'range', value: 'Arc' }, ...hw('Amplifier')]),
    tech('basic', 'Inertia Bypass', hw('Booster', 'Gravlock', 'Gyro')),
    tech('basic', 'Neural Mapping', [{ category: 'weapon', property: 'type', value: 'Guided' }, ...hw('Disruptor')]),
    tech('basic', 'Compressed Fuels', hw('Hoverfoil', 'Intake', 'Jet')),

    // advanced tech
    tech('advanced', 'Heat Matrix', hw('Hotstepper', 'Casing', 'Vent')),
    tech('advanced', 'Overkill Doctrine', [{ category: 'weapon', property: 'power', value: 4 }]),
    tech('advanced', 'Supercatalysts', [{ category: 'weapon', property: 'subtype', value: 'Radiation' }, ...hw('Prism')]),
    tech('advanced', 'Drive Enhancement', hw('Carrier', 'Dozer', 'Transport')),
    tech('advanced', 'Stabilised Quantum Matter', hw('Cloak', 'Reflector')),
    tech('advanced', 'Final-Gen AI', hw('ECM', 'Guardian', 'Precog')),
    tech('advanced', 'Reactive Magnetics', [{ category: 'weapon', property: 'subtype', value: 'Jolt' }, ...hw('Hooks')]),
    tech('advanced', 'Macro Munitions', [{ category: 'weapon', property: 'power', value: 3 }]),
    tech('advanced', 'Branch Interfacing', [{ category: 'rule', value: 'Double Modules' }]),
    tech('advanced', 'Tri-Core Fusion', [{ category: 'mac', value: 3 }]),
]

/**
 * Connections between advanced techs (the lines of the chart, undirected).
 * Where several lines meet in a junction every pair is listed.
 */
export const advancedLinks: [string, string][] = [
    ['Heat Matrix', 'Overkill Doctrine'],
    ['Overkill Doctrine', 'Supercatalysts'],
    ['Supercatalysts', 'Drive Enhancement'],
    ['Drive Enhancement', 'Stabilised Quantum Matter'],
    ['Stabilised Quantum Matter', 'Reactive Magnetics'],
    // Final-Gen AI joins the line between Stabilised Quantum Matter and Reactive Magnetics
    ['Final-Gen AI', 'Stabilised Quantum Matter'],
    ['Final-Gen AI', 'Reactive Magnetics'],
    ['Final-Gen AI', 'Macro Munitions'],
    ['Macro Munitions', 'Reactive Magnetics'],
    ['Macro Munitions', 'Branch Interfacing'],
    ['Reactive Magnetics', 'Tri-Core Fusion'],
    ['Overkill Doctrine', 'Tri-Core Fusion'],
    ['Stabilised Quantum Matter', 'Tri-Core Fusion'],
]

/**
 * Connections from the basic techs into the advanced part of the chart (undirected).
 * Several basic techs sharing a line all connect to the advanced techs at the end of that line.
 */
export const basicLinks: [string, string][] = [
    // Thermal Osmosis, Hypertracking and Active Fibres share a line to Heat Matrix and Supercatalysts
    ['Thermal Osmosis', 'Heat Matrix'],
    ['Hypertracking', 'Heat Matrix'],
    ['Active Fibres', 'Heat Matrix'],
    ['Thermal Osmosis', 'Supercatalysts'],
    ['Hypertracking', 'Supercatalysts'],
    ['Active Fibres', 'Supercatalysts'],

    // Two-State Metals, Grav-Regulation and Force Expansion lead to Drive Enhancement
    ['Two-State Metals', 'Drive Enhancement'],
    ['Grav-Regulation', 'Drive Enhancement'],
    ['Force Expansion', 'Drive Enhancement'],

    // Force Expansion and Inertia Bypass lead to Final-Gen AI
    ['Force Expansion', 'Final-Gen AI'],
    ['Inertia Bypass', 'Final-Gen AI'],

    // Neural Mapping and Compressed Fuels lead to Macro Munitions, Compressed Fuels also to Branch Interfacing
    ['Neural Mapping', 'Macro Munitions'],
    ['Compressed Fuels', 'Macro Munitions'],
    ['Compressed Fuels', 'Branch Interfacing'],
]

export const techLinks: [string, string][] = [...basicLinks, ...advancedLinks]

const byName = new Map(techs.map(t => [t.name, t]))

export const edges = techLinks.map(([a, b]) => {
    const from = byName.get(a)
    const to = byName.get(b)
    if (!from || !to) throw new Error(`Unknown tech in link: ${a} - ${b}`)
    return { from: from.key, to: to.key }
})

export const neighbours = new Map<string, Set<string>>(techs.map(t => [t.key, new Set<string>()]))
for (const { from, to } of edges) {
    neighbours.get(from)!.add(to)
    neighbours.get(to)!.add(from)
}

export default techs
