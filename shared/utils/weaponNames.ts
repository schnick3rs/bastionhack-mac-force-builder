import examples from "~~/server/data/exampleForceRepository";
import {notableWeapons} from "~~/server/data/notableWeaponRepository";

/**
 * Random weapon names that fit what the weapon does.
 *
 * A name is `<prefix><suffix>` (e.g. "ToxicSprayer"), both parts are picked from pools that depend on range, type,
 * subtype, power and expendable. Pools of the subtype weigh more, so a radiation weapon sounds like one.
 * Weapons with the exact profile of a notable weapon of the army book (or of one of the example forces)
 * often get its name, e.g. SP1 LaserCarbine or LB2 AutoCannon.
 */

export interface WeaponNameInput {
    range: 'Short' | 'Long' | 'Arc' | 'Brawl' | string
    type: 'Burst' | 'Piercing' | 'Guided' | 'Multi' | string
    /** Thermal, Jolt, Radiation (more than one possible) */
    subtypes?: (string | undefined)[]
    expendable?: boolean
    power?: number
}

interface Pool { prefix: string[], suffix: string[] }

const neutral: Pool = {
    prefix: ['Laser', 'Auto', 'Plasma', 'Ion', 'Pulse', 'Storm', 'Iron', 'Steel', 'Flare', 'Thunder'],
    suffix: ['Cannon', 'Carbine', 'Rifle', 'Launcher', 'Repeater', 'Flak', 'Gun', 'Blaster', 'Hammer', 'Pod'],
}

const byType: Record<string, Pool> = {
    Burst: { prefix: ['Auto', 'Rapid', 'Scatter', 'Storm', 'Flak'], suffix: ['Repeater', 'Flak', 'Gun', 'Cannon'] },
    Piercing: { prefix: ['Rail', 'Spike', 'Needle', 'Lance', 'Pulse', 'Alpha'], suffix: ['Lance', 'Driver', 'Spiker', 'Beam', 'Carbine'] },
    Guided: { prefix: ['Smart', 'Seeker', 'Hunter', 'Homing', 'Tracker', 'Probe'], suffix: ['Seeker', 'Tracker', 'Hunter', 'Cannon', 'Ray'] },
    Multi: { prefix: ['Twin', 'Multi', 'Split', 'Swarm', 'Cluster', 'Flak'], suffix: ['Spreader', 'Matrix', 'Repeater'] },
}

const byRange: Record<string, Pool> = {
    Long: { prefix: ['Sniper', 'Long', 'Far', 'Macro'], suffix: ['Rifle', 'Lance', 'Railgun', 'Annihilator'] },
    Arc: { prefix: ['Arc', 'Sky'], suffix: ['Thrower', 'Siege', 'Mortar', 'Sling', 'Howitzer'] },
}

const bySubtype: Record<string, Pool> = {
    Radiation: { prefix: ['Toxic', 'Toxi', 'Radiation', 'Acid', 'Tox', 'Rad', 'Gamma'], suffix: ['Vomit', 'Bile', 'Thrower', 'Sprayer', 'Ray'] },
    Jolt: { prefix: ['Frost', 'Static', 'Glue', 'Web', 'Shock', 'Bolt'], suffix: ['Freezer', 'Discharger', 'Disruptor', 'Webber', 'Glue', 'Orb', 'Caster'] },
    Thermal: { prefix: ['Heat', 'Fusion', 'Flame', 'Flare', 'Hell', 'Burn'], suffix: ['Burner', 'Ray', 'Thrower', 'Surge', 'Incinerator'] },
}

const expendable: Pool = {
    prefix: ['Frag'],
    suffix: ['Missile', 'Missiles', 'Rocket', 'Rockets', 'Bomb', 'Bombs', 'Pods', 'Charges'],
}

// big guns and small ones
const heavy: Pool = { prefix: ['God', 'Mega', 'Hell', 'Thunder', 'Macro', 'Imploder'], suffix: ['Hammer', 'Annihilator', 'Cannon'] }
const light: Pool = { prefix: ['Laser', 'Flash', 'Pulse', 'Micro'], suffix: ['Pulser', 'Carbine', 'Gun'] }

/** Extras for combinations, e.g. a thermal burst weapon is a flamer. */
const combos: { when: (i: WeaponNameInput, subs: string[]) => boolean, pool: Pool }[] = [
    { when: (i, s) => s.includes('Thermal') && i.type === 'Burst', pool: { prefix: [], suffix: ['Flamer', 'Spitter'] } },
    { when: (i, s) => s.includes('Thermal') && i.type === 'Piercing', pool: { prefix: ['Melta'], suffix: ['Ray', 'Lance'] } },
    { when: (i, s) => s.includes('Radiation') && i.type === 'Burst', pool: { prefix: [], suffix: ['Sprayer'] } },
    { when: (i, s) => s.includes('Radiation') && i.range === 'Arc', pool: { prefix: [], suffix: ['Mortar'] } },
    { when: (i, s) => s.includes('Radiation') && i.type === 'Piercing', pool: { prefix: ['Gamma', 'Alpha'], suffix: ['Beam', 'Lance'] } },
    { when: (i, s) => s.includes('Jolt') && i.range === 'Arc', pool: { prefix: [], suffix: ['Webber'] } },
    { when: i => !!i.expendable && i.type === 'Guided', pool: { prefix: [], suffix: ['Missile', 'Seeker'] } },
    { when: i => !!i.expendable && i.range === 'Arc', pool: { prefix: [], suffix: ['Bomb', 'Mortar'] } },
    { when: i => !!i.expendable && i.type === 'Multi', pool: { prefix: [], suffix: ['Rockets', 'Swarm'] } },
    { when: i => !!i.expendable && i.type === 'Piercing', pool: { prefix: [], suffix: ['Harpoon'] } },
]

// ---- known names ----------------------------------------------------------------------------------

const CODE = /^([SLA])?([BPGM])(\d)(?:-([TJR])?(X)?)?\s+(.+)$/

/** Code of a weapon profile as written in the book: range, type, power, subtype, X for expendable. */
export function weaponCode(input: WeaponNameInput): string | undefined {
    if (input.power === undefined || input.range === 'Brawl') return undefined
    const sub = (input.subtypes ?? []).find(Boolean)
    const range = ({ Short: 'S', Long: 'L', Arc: 'A' } as Record<string, string>)[input.range]
    const type = input.type[0]
    if (!range || !type) return undefined
    const tail = `${sub ? sub[0] : ''}${input.expendable ? 'X' : ''}`
    return `${range}${type}${input.power}${tail ? '-' : ''}${tail}`
}

let knownNames: Map<string, string[]> | undefined

/** code -> names, from the notable weapons and the weapons of all example forces */
function known() {
    if (knownNames) return knownNames
    const map = new Map<string, Set<string>>()
    const add = (text: string) => {
        const m = CODE.exec(text.trim())
        if (!m) return
        const code = text.trim().split(/\s+/)[0]!
        const name = m[6]!
        // only names that are made of two parts (LaserCarbine), plain "Cannon" or "Rockets" are too generic
        if (!/[a-z][A-Z]/.test(name)) return
        if (!map.has(code)) map.set(code, new Set())
        map.get(code)!.add(name)
    }
    notableWeapons.forEach(w => add(`${w.code} ${w.name}`))
    for (const force of Object.values(examples)) {
        force.macs.forEach(mac => mac.modules.forEach(add))
        force.formations.forEach(f => f.weapons.forEach(add))
    }
    knownNames = new Map([...map.entries()].map(([code, names]) => [code, [...names]]))
    return knownNames
}

// ---- generator --------------------------------------------------------------------------------------

export function generateWeaponName(input: WeaponNameInput, random: () => number = Math.random): string {
    const pick = (list: string[]) => list[Math.floor(random() * list.length)]!
    const subs = (input.subtypes ?? []).filter((s): s is string => !!s)

    // a weapon with the profile of a known one often gets its name
    const code = weaponCode(input)
    const names = code ? known().get(code) : undefined
    if (names?.length && random() < 0.5) return pick(names)

    const prefixes: string[] = []
    const suffixes: string[] = []
    const add = (pool: Pool | undefined, weight = 1) => {
        if (!pool) return
        for (let i = 0; i < weight; i++) {
            prefixes.push(...pool.prefix)
            suffixes.push(...pool.suffix)
        }
    }

    add(byType[input.type])
    add(byRange[input.range])
    // the subtype defines what the weapon does, it weighs double
    for (const s of subs) add(bySubtype[s], 2)
    if (input.expendable) add(expendable)
    if ((input.power ?? 0) >= 4) add(heavy)
    if (input.power === 1) add(light)
    for (const c of combos) if (c.when(input, subs)) add(c.pool, 2)

    // an occasional neutral part keeps the names varied
    const prefix = !prefixes.length || random() < 0.2 ? pick(neutral.prefix) : pick(prefixes)
    let suffix = !suffixes.length || random() < 0.15 ? pick(neutral.suffix) : pick(suffixes)
    // no echoes like "FlameFlamer" or "RadRad"
    const echoes = (a: string, b: string) => a.toLowerCase().slice(0, 4) === b.toLowerCase().slice(0, 4)
    for (let tries = 0; echoes(prefix, suffix) && tries < 8; tries++) suffix = pick(suffixes.length ? suffixes : neutral.suffix)

    return `${prefix}${suffix}`
}
