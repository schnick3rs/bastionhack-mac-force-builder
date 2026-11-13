import examples from "~~/server/data/exampleForceRepository";
import {notableWeapons} from "~~/server/data/notableWeaponRepository";
import {parseExampleWeapon} from "#shared/utils/examples";
import {factionName} from "#shared/utils/factions";
import type {WeaponProfile} from "~~/types/unit";

export interface ArsenalEntry {
    key: string
    /** range, type, power and subtype in the usual notation, e.g. "LB2-TX" */
    code: string
    name: string
    range: string
    type: string
    power: number
    /** thermal, jolt, radiation and expendable */
    subtypes: string[]
    notable: boolean
    /** the factions whose example force fields the weapon, with the number of units that carry it */
    factions: { key: string, name: string, count: number }[]
}

const CODE = /^([SLA])?([BPGM])(\d)(?:-([TJR])?(X)?)?\s+(.+)$/

function entryFor(code: string, name: string, profile: WeaponProfile): ArsenalEntry {
    return {
        key: `${code} ${name}`,
        code,
        name,
        range: profile.range,
        type: profile.type,
        power: profile.power,
        subtypes: [...(profile.subtype ? [profile.subtype] : []), ...(profile.expendable ? ['Expendable'] : [])],
        notable: false,
        factions: [],
    }
}

const rangeOrder = ['Short', 'Long', 'Arc', 'Brawl']
const typeOrder = ['Burst', 'Piercing', 'Guided', 'Multi']

/** All notable weapons and the weapons of the example forces, each one once. */
export function buildArsenal(): ArsenalEntry[] {
    const entries = new Map<string, ArsenalEntry>()

    const get = (text: string): ArsenalEntry | undefined => {
        const m = CODE.exec(text.trim())
        const profile = parseExampleWeapon(text)
        if (!m || !profile) return undefined
        const code = text.trim().split(/\s+/)[0]!
        const key = `${code} ${profile.name}`
        if (!entries.has(key)) entries.set(key, entryFor(code, profile.name, profile))
        return entries.get(key)
    }

    for (const w of notableWeapons) {
        const entry = get(`${w.code} ${w.name}`)
        if (entry) entry.notable = true
    }

    for (const [factionKey, force] of Object.entries(examples)) {
        const texts = [
            ...force.macs.flatMap(mac => mac.modules),
            // formations carry their weapons on every unit of the formation, but count the formation once
            ...force.formations.flatMap(f => f.weapons),
        ]
        for (const text of texts) {
            const entry = get(text)
            if (!entry) continue
            const faction = entry.factions.find(f => f.key === factionKey)
            if (faction) faction.count++
            else entry.factions.push({ key: factionKey, name: factionName(factionKey), count: 1 })
        }
    }

    return [...entries.values()].sort((a, b) =>
        rangeOrder.indexOf(a.range) - rangeOrder.indexOf(b.range) ||
        typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type) ||
        a.power - b.power ||
        a.name.localeCompare(b.name))
}
