import type {WeaponProfile, WeaponRange, WeaponSubtype, WeaponType} from "~~/types/unit";

const regex = /(?<range>\D?)(?<type>\D)(?<power>\d)-?(?<ex>X)?(?<sub>\D)?\s(?<name>\w*)/;

const rangeMap: Record<string, WeaponRange> = {
    "S": "Short",
    "L": "Long",
    "A": "Arc",
}

const typeMap: Record<string, WeaponType> = {
    "B": "Burst",
    "P": "Piercing",
    "G": "Guided",
    "M": "Multi",
}

const subtypeMap: Record<string, WeaponSubtype> = {
    "J": "Jolt",
    "T": "Thermal",
    "R": "Radiation",
}

export function parseWeaponString(input: string): WeaponProfile | null {
    const match = regex.exec(input);
    if (!match || !match.groups) return null;

    const range = match.groups.range || undefined;
    const type = match.groups.type as string;
    const power = match.groups.power as string;
    const sub = match.groups.sub as string;
    const ex = match.groups.ex as string;
    const name = match.groups.name as string;

    return {
        range: range ? rangeMap[range] : "Brawl",
        type: typeMap[type] ?? "Burst",
        power: parseInt(power, 10),
        expendable: !!ex, // any expendable marker works
        subType: subtypeMap[sub],
        name,
    };
}

export function buildWeaponDisplayString(weapon: WeaponProfile) {
    const subtype = `${weapon.subType ? weapon.subType[0] : ''}${weapon.expendable ? 'X' : ''}`
    return `${weapon.range ? weapon.range[0] : ''}${weapon.type[0]}${weapon.power}${!!subtype ? '-' : ''}${subtype} ${weapon.name}`;
}