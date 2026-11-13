/**
 * Scrap Mode (campaign mode): players build their forces from a limited heap of components.
 * Random chassis table, roll 2d6.
 *
 * Modules use the code notation of the example repository, weapons like "SB1 StormGun",
 * everything else is hardware. Slots that stay empty are treated as frame modules.
 */

export interface ScrapChassis {
    roll: number
    name: string
    class: 1 | 2 | 3
    modules: string[]
    perk?: string
    flaw?: string
}

export const scrapChassisTable: ScrapChassis[] = [
    { roll: 2, name: 'Guardian', class: 2, modules: ['SB1 StormGun', 'Shield'] },
    { roll: 3, name: 'Militia', class: 2, modules: ['LB2 AutoCannon', 'Plate'] },
    { roll: 4, name: 'Miner', class: 2, modules: ['P2 Piston', 'P2 Piston'] },
    { roll: 5, name: 'Lifter', class: 2, modules: ['G2 Grapple', 'Guardian'] },
    { roll: 6, name: 'Lumberjack', class: 1, modules: ['B2 Blade', 'B2 Blade', 'Servo', 'Plate'], perk: 'Focused' },
    { roll: 7, name: 'Explorer', class: 1, modules: ['SG1 SmartGun', 'Mesh', 'Servo', 'Gyro'], perk: 'Sprinter' },
    { roll: 8, name: 'Stalker', class: 1, modules: ['LP2 RailGun', 'Cloak', 'Intake', 'Jet'], perk: 'Stealthy' },
    { roll: 9, name: 'Prototype', class: 3, modules: [], flaw: 'Explosive' },
    { roll: 10, name: 'Gladiator', class: 3, modules: [], flaw: 'Stiff' },
    { roll: 11, name: 'Demolisher', class: 3, modules: [], flaw: 'Frontloaded' },
    { roll: 12, name: 'Giant', class: 3, modules: [], flaw: 'Deadmeat' },
]

// ---------------------------------------------------------------------------------------------
// Random module
// ---------------------------------------------------------------------------------------------

/** Civilian hardware, roll 2d6. Two entries mean "X or Y" (the player chooses). */
export const civilianHardwareTable: Record<number, string[]> = {
    2: ['Guardian'],
    3: ['Precog', 'M2 Mower'],
    4: ['Booster'],
    5: ['Jet', 'Intake'],
    6: ['Disruptor'],
    7: ['Radiator'],
    8: ['Gyro', 'P2 Piston'],
    9: ['Tether'],
    10: ['Coolant'],
    11: ['Servo'],
    12: ['Vent'],
}

/** Military hardware, roll 2d6. */
export const militaryHardwareTable: Record<number, string[]> = {
    2: ['Casing'],
    3: ['Reflector'],
    4: ['Cloak'],
    5: ['Catalyst'],
    6: ['Mesh'],
    7: ['Plate'],
    8: ['Amplifier', 'B2 Blade'],
    9: ['Jet', 'Hotstepper'],
    10: ['Thruster'],
    11: ['Conductor', 'G2 Grapple'],
    12: ['Shield'],
}

// weapon tables, each rolled with a d6 (index = roll - 1)
export const scrapWeaponRange = ['S', 'S', 'S', 'L', 'L', 'A']
export const scrapWeaponType = ['B', 'B', 'P', 'P', 'G', 'M']
export const scrapWeaponPower = [1, 1, 2, 2, 3, 4]

/** Subtype roll: 1 = expendable only, 2 = expendable plus a second subtype, 3-4 thermal, 5 jolt, 6 rad. */
export const scrapWeaponSubtype = ['X', 'X+', 'T', 'T', 'J', 'R']
/** Second subtype after an expendable "2": expendable again means no second subtype. */
export const scrapWeaponSecondSubtype = ['', '', 'T', 'T', 'J', 'R']

export default scrapChassisTable;
