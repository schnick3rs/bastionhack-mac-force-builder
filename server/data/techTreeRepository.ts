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

/**
 * Something a force gains access to.
 * `mac` and `weapon.power` hold the highest allowed value, the highest one a force has wins.
 * `restriction` limits a hardware module to one kind of auxiliary unit (e.g. vehicle armour).
 */
export type Unlock =
    | { type: 'hardware', value: string, restriction?: UnitType }
    | { type: 'mac', value: 1 | 2 | 3 }
    | { type: 'unit', value: UnitType }
    | { type: 'weapon.range', value: WeaponRange }
    | { type: 'weapon.type', value: WeaponType }
    | { type: 'weapon.subtype', value: WeaponSubtype | 'Expendable' }
    | { type: 'weapon.power', value: number }
    | { type: 'rule', value: string }

export interface Tech {
    key: string
    name: string
    tier: TechTier
    unlocks: Unlock[]
}

const hw = (...names: string[]): Unlock[] => names.map(value => ({ type: 'hardware', value }))

export const startingAccess: Unlock[] = [
    { type: 'mac', value: 1 },
    { type: 'mac', value: 2 },
    { type: 'weapon.power', value: 2 },
    { type: 'weapon.range', value: 'Short' },
    { type: 'weapon.range', value: 'Long' },
    { type: 'weapon.type', value: 'Burst' },
    { type: 'weapon.type', value: 'Piercing' },
    { type: 'weapon.subtype', value: 'Expendable' },
    ...hw('Frame', 'Plate', 'Radiator', 'Servo'),
    { type: 'unit', value: 'Infantry' },
    { type: 'unit', value: 'Vehicle' },
    { type: 'hardware', value: 'Armour', restriction: 'Vehicle' },
]

/** Readable text of an unlock, e.g. "Armour (Vehicle only)" or "Weapons up to power 3". */
export function describeUnlock(u: Unlock): string {
    switch (u.type) {
        case 'hardware': return u.restriction ? `${u.value} (${u.restriction} only)` : u.value
        case 'mac': return `Class ${u.value} MACs`
        case 'unit': return `${u.value} AUs`
        case 'weapon.range': return u.value === 'Brawl' ? 'Brawl weapons' : `${u.value} range`
        case 'weapon.type': return `${u.value} type`
        case 'weapon.subtype': return `${u.value} subtype`
        case 'weapon.power': return `Power ${u.value} weapons`
        case 'rule': return u.value
    }
}

/** What a force has access to, merged from a list of unlocks. */
export function summarizeAccess(unlocks: Unlock[]) {
    const access = {
        maxMacClass: 0,
        maxWeaponPower: 0,
        units: new Set<UnitType>(),
        weaponRanges: new Set<WeaponRange>(),
        weaponTypes: new Set<WeaponType>(),
        weaponSubtypes: new Set<string>(),
        rules: new Set<string>(),
        // hardware name -> units it may be used by, null = no restriction
        hardware: new Map<string, Set<UnitType> | null>(),
    }
    for (const u of unlocks) {
        switch (u.type) {
            case 'mac': access.maxMacClass = Math.max(access.maxMacClass, u.value); break
            case 'weapon.power': access.maxWeaponPower = Math.max(access.maxWeaponPower, u.value); break
            case 'unit': access.units.add(u.value); break
            case 'weapon.range': access.weaponRanges.add(u.value); break
            case 'weapon.type': access.weaponTypes.add(u.value); break
            case 'weapon.subtype': access.weaponSubtypes.add(u.value); break
            case 'rule': access.rules.add(u.value); break
            case 'hardware': {
                if (!u.restriction) {
                    access.hardware.set(u.value, null)
                } else if (access.hardware.get(u.value) !== null) {
                    const set = access.hardware.get(u.value) ?? new Set<UnitType>()
                    set.add(u.restriction)
                    access.hardware.set(u.value, set)
                }
                break
            }
        }
    }
    return {
        maxMacClass: access.maxMacClass,
        maxWeaponPower: access.maxWeaponPower,
        units: [...access.units],
        weaponRanges: [...access.weaponRanges],
        weaponTypes: [...access.weaponTypes],
        weaponSubtypes: [...access.weaponSubtypes],
        rules: [...access.rules],
        hardware: [...access.hardware.entries()].map(([name, units]) => ({ name, usableBy: units ? [...units] : null })),
    }
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const tech = (tier: TechTier, name: string, unlocks: Unlock[]): Tech => ({ key: slug(name), name, tier, unlocks })

export const techs: Tech[] = [
    // basic tech, in the order of the book
    tech('basic', 'Thermal Osmosis', hw('Catalyst', 'Conductor', 'Emitter')),
    tech('basic', 'Hypertracking', [{ type: 'weapon.type', value: 'Multi' }, ...hw('Shield')]),
    tech('basic', 'Active Fibres', [{ type: 'weapon.range', value: 'Brawl' }, ...hw('Mesh', 'Rotor')]),
    tech('basic', 'Two-State Metals', [{ type: 'weapon.subtype', value: 'Thermal' }, ...hw('Coolant')]),
    tech('basic', 'Grav-Regulation', [{ type: 'hardware', value: 'Armour', restriction: 'Infantry' }, ...hw('Tether', 'Aerodrive')]),
    tech('basic', 'Force Expansion', [{ type: 'weapon.range', value: 'Arc' }, ...hw('Amplifier')]),
    tech('basic', 'Inertia Bypass', hw('Booster', 'Gravlock', 'Gyro')),
    tech('basic', 'Neural Mapping', [{ type: 'weapon.type', value: 'Guided' }, ...hw('Disruptor')]),
    tech('basic', 'Compressed Fuels', hw('Hoverfoil', 'Intake', 'Jet')),

    // advanced tech
    tech('advanced', 'Heat Matrix', hw('Hotstepper', 'Casing', 'Vent')),
    tech('advanced', 'Overkill Doctrine', [{ type: 'weapon.power', value: 4 }]),
    tech('advanced', 'Supercatalysts', [{ type: 'weapon.subtype', value: 'Radiation' }, ...hw('Prism')]),
    tech('advanced', 'Drive Enhancement', hw('Carrier', 'Dozer', 'Transport')),
    tech('advanced', 'Stabilised Quantum Matter', hw('Cloak', 'Reflector')),
    tech('advanced', 'Final-Gen AI', hw('ECM', 'Guardian', 'Precog')),
    tech('advanced', 'Reactive Magnetics', [{ type: 'weapon.subtype', value: 'Jolt' }, ...hw('Hooks')]),
    tech('advanced', 'Macro Munitions', [{ type: 'weapon.power', value: 3 }]),
    tech('advanced', 'Branch Interfacing', [{ type: 'rule', value: 'Double Modules' }]),
    tech('advanced', 'Tri-Core Fusion', [{ type: 'mac', value: 3 }]),
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
