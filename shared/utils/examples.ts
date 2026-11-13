import type {Auxiliary, Entry, Formation, MAC, ModuleConfig, WeaponProfile} from "~~/types/unit";
import examples from "~~/server/data/exampleForceRepository";
import type {ExampleFormation, ExampleMac} from "~~/server/data/exampleForceRepository";
import {rangeMap, subtypeMap, typeMap} from "#shared/utils/weapons";

// <range><type><power>[-<subtype>][X] <name>, brawl weapons have no range letter
const WEAPON_CODE = /^([SLA])?([BPGM])(\d)(?:-([TJR])?(X)?)?\s+(.+)$/

export function parseExampleWeapon(code: string): WeaponProfile | null {
    const m = WEAPON_CODE.exec(code.trim())
    if (!m) return null
    const [, range, type, power, subtype, expendable, name] = m
    return {
        range: range ? rangeMap[range]! : 'Brawl',
        type: typeMap[type!]!,
        power: parseInt(power!, 10),
        subtype: subtype ? subtypeMap[subtype] : undefined,
        expendable: !!expendable,
        name: name!,
    }
}

function toModule(slot: number, text: string): ModuleConfig {
    const weapon = parseExampleWeapon(text)
    if (weapon) return {slot, type: 'Weapon', double: false, profile: weapon}
    return {slot, type: 'Hardware', double: false, profile: {name: text}}
}

export interface ExampleUnit {
    key: string
    /** e.g. "The Reaper" or "2× Cutter" */
    name: string
    /** e.g. "Class 2 MAC" or "Vehicle Formation" */
    type: string
    /** builds a fresh entry (new id) each time it is called */
    build: () => Entry
}

function macEntry(m: ExampleMac): MAC {
    const modules: ModuleConfig[] = m.modules.map((text, i) => toModule(i + 1, text))
    if (m.zero) modules.unshift(toModule(0, m.zero))
    return {
        id: crypto.randomUUID(),
        name: m.name,
        classification: 'MAC',
        class: m.class,
        modules,
        perks: [],
        flaws: [],
        pilot: undefined,
        division: undefined,
    }
}

function formationEntry(f: ExampleFormation): Formation {
    const unit: Auxiliary = {
        classification: 'Auxiliary unit',
        name: f.name,
        type: f.type,
        weapons: f.weapons.map(parseExampleWeapon).filter((w): w is WeaponProfile => !!w),
        hardware: f.hardware.map(name => ({name})),
    }
    return {
        classification: 'Formation',
        id: crypto.randomUUID(),
        size: f.size,
        unit,
        division: undefined,
    }
}

/** The example units of a faction, MACs first. */
export function getExampleUnits(factionKey: string | undefined): ExampleUnit[] {
    const example = factionKey ? examples[factionKey] : undefined
    if (!example) return []

    return [
        ...example.macs.map((m): ExampleUnit => ({
            key: m.name,
            name: m.name,
            type: `Class ${m.class} MAC`,
            build: () => macEntry(m),
        })),
        ...example.formations.map((f): ExampleUnit => ({
            key: f.name,
            name: `${f.size}× ${f.name}`,
            type: `${f.type} Formation`,
            build: () => formationEntry(f),
        })),
    ]
}
