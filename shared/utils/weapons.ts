import type {WeaponProfile, WeaponRange, WeaponSubtype, WeaponType} from "~~/types/unit";

const regex = /(?<range>\D?)(?<type>\D)(?<power>\d)-?(?<ex>X)?(?<sub>\D)?\s(?<name>\w*)/;

export const rangeMap: Record<string, WeaponRange> = {
    "S": "Short",
    "L": "Long",
    "A": "Arc",
    "B": "Brawl",
}

export const rangeHint: Record<WeaponRange, string> = {
    "Short": '12” maximum',
    "Long": '6” minimum',
    "Arc": '12” minimum, may fire indirectly at targets to which an ally is in 6” and line of sight',
    "Brawl": 'Adds <power> AD when brawling',
}

export const typeHint: Record<WeaponType, string> = {
    'Burst': 'For each miss, roll an extra attack die.',
    'Piercing': 'For each hit, roll an extra attack die.',
    'Guided': 'The TN is the lower of the target and attacker’s Motion values multiplied by 2. Modifiers are then applied as normal.',
    'Multi': 'You may make a second attack with this weapon, for 0 Heat, against a different valid target within 6” of the first target. Expendable weapons can still make this second attack.',
}

export const subtypeHint: Record<WeaponSubtype | "Expendable", string> = {
    'Thermal': 'Ignore cover and building modifiers to TN. Each hit to a MAC causes 1 Heat instead of a normal hit.',
    'Jolt': 'Each hit causes 1 Jolt instead of a normal hit. If a unit shifts, rushes, or jumps, they take 2 hits for each point of Jolt, then remove all Jolt. Apply the hits at the end of the move. If a unit holds they remove all Jolt without taking hits. Jolt attacks against buildings cause normal hits instead of Jolt. A unit cannot have more than 6 Jolt.',
    'Radiation': 'Each hit causes 1 Rad instead of a normal hit. At the end of cooldown all units take hits equal to their Rad value. They then halve their Rad value, rounding up. Rad attacks cannot target buildings. A unit cannot have more than 6 Rad.',
    'Expendable': 'Roll extra AD equal to power. Depleted (not destroyed) after one attack.',
}

export const typeMap: Record<string, WeaponType> = {
    "B": "Burst",
    "P": "Piercing",
    "G": "Guided",
    "M": "Multi",
}

export const subtypeMap: Record<string, WeaponSubtype> = {
    "T": "Thermal",
    "J": "Jolt",
    "R": "Radiation",
}

export function parseWeaponString(input: string): WeaponProfile | null {
    const match = regex.exec(input);
    if (!match || !match.groups) return null;

    const range = match.groups.range || "B";
    const type = match.groups.type as string;
    const power = match.groups.power as string;
    const sub = match.groups.sub as string;
    const ex = match.groups.ex as string;
    const name = match.groups.name as string;

    return {
        range: rangeMap[range] ?? "Brawl",
        type: typeMap[type] ?? "Burst",
        power: parseInt(power, 10),
        expendable: !!ex, // any expendable marker works
        subtype: subtypeMap[sub],
        name,
    };
}

export function buildWeaponCodeString(weapon: WeaponProfile) {
    const subtype = `${weapon.subtype ? weapon.subtype[0] : ''}${weapon.expendable ? 'X' : ''}`
    return `${weapon.range != "Brawl" ? weapon.range[0] : ''}${weapon.type[0]}${weapon.power}${!!subtype ? '-' : ''}${subtype}`;
}

export function buildWeaponDisplayString(weapon: WeaponProfile) {
    const subtype = `${weapon.subtype ? weapon.subtype[0] : ''}${weapon.expendable ? 'X' : ''}`
    return `${weapon.range != "Brawl" ? weapon.range[0] : ''}${weapon.type[0]}${weapon.power}${!!subtype ? '-' : ''}${subtype} ${weapon.name}`;
}