/**
 * Notable weapons: any combination of range, type, power and subtype is possible,
 * but some weapons have carved out a reputation for themselves.
 */

export interface NotableWeapon {
    /** range, type, power and subtype in the usual notation, e.g. "LB2-TX" */
    code: string
    name: string
}

export const notableWeapons: NotableWeapon[] = [
    { code: 'SP1', name: 'LaserCarbine' },
    { code: 'LB2', name: 'AutoCannon' },
    { code: 'AG4', name: 'GodHammer' },
    { code: 'AB2', name: 'Howitzer' },
    { code: 'LP4', name: 'Annihilator' },
    { code: 'LG2', name: 'SmartCannon' },
    { code: 'SM1', name: 'FlakRepeater' },
    { code: 'LP4-X', name: 'ImploderPod' },
    { code: 'AM2-J', name: 'ShockOrb' },
    { code: 'SP1-X', name: 'FusionBomb' },
    { code: 'SP2-R', name: 'GammaRay' },
    { code: 'SB4-T', name: 'HellSurge' },
    { code: 'LB2-TX', name: 'FlareMissiles' },
    { code: 'AB3-JX', name: 'BarometricBombs' },
    { code: 'SP2-RX', name: 'ToxiPods' },
]

export default notableWeapons
