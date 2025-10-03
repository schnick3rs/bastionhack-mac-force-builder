import type {Auxiliary, Entry, Force, Formation, MAC} from '~~/types/unit'

// restrict to only valid MAC classes
const classToCost: Record<MAC['class'], number> = {
    1: 12,
    2: 16,
    3: 20,
}

export function calculateForceCost(force: Force): number {
    return force.entries.reduce((acc, entry) => acc + calculateEntityCost(entry), 0);
}

export function calculateEntityCost(entry: Entry): number {
    if (entry.classification === 'MAC') {
        return calculateMacCost(entry as MAC);
    }
    if (entry.classification === 'Formation') {
        return calculateFormationCost(entry as Formation);
    }
    return 0;
}

export function calculateMacCost(mac: MAC): number {
    if (!(mac.class in classToCost)) {
        throw new Error(`Invalid MAC class: ${mac.class}`)
    }
    const baseCost: number = classToCost[mac.class] as number;

    const frameModuleCount = mac.modules
        .filter(module => module.type === 'Hardware')
        .filter(module => module.profile.name === 'Frame')
        .length;

    const doubleModuleCount = mac.modules
        .filter(module => module.type === 'Hardware' || module.type === 'Weapon')
        .filter(module => module.double === true)
        .length;

    return baseCost - frameModuleCount + doubleModuleCount;
}

export function calculateFormationCost(formation: Formation): number {
    return formation.size * calculateAuxiliaryCost(formation.unit);
}

export function calculateAuxiliaryCost(auxiliary: Auxiliary): number {

    const numberHardware = auxiliary.hardware.length;

    const totalWeaponPower = auxiliary.weapons
        .map(profile => profile.power)
        .reduce((a, b) => a + b, 0);

    return 1 + numberHardware + totalWeaponPower;
}

export function calcMaxWeaponPower(entry: Entry, slot: number = 0): number {
    if (entry.classification === 'MAC') {
        const slotBonus = (slot && slot === 1) ? 1 : 0;
        return entry.class + slotBonus;
    }
    if (entry.classification === 'Formation') {
        if (entry.unit.type === 'Infantry') {
            return 1;
        }
        if (entry.unit.type === 'Vehicle') {
            return 2;
        }
    }
    return 4
}