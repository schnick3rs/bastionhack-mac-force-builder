
export type ModuleConfig =
    | { slot: number; type: 'Hardware'; double: boolean; profile: HardwareProfile }
    | { slot: number; type: 'Weapon';  double: boolean; profile: WeaponProfile }
    | { slot: number; type: 'Empty' }

export type Usability = 'MAC' | 'Infantry' | 'Vehicle' | 'All'

export type Origin = 'common' | 'faction'

export interface HardwareModule {
    key: string,
    name: string,
    effect: string,
    usability: Usability[],
    origin: Origin
}

export interface HardwareProfile {
    name: string,
}

export type WeaponRange = 'Brawl' | 'Short' | 'Long' | 'Arc'
export type WeaponType = 'Burst' | 'Piercing' | 'Guided' | 'Multi'
export type WeaponSubtype = 'Thermal' | 'Jolt' | 'Radiation'

export interface WeaponProfile {
    range: WeaponRange,
    type: WeaponType,
    subtype?: WeaponSubtype,
    expendable: boolean,
    power: number,
    name: string,
}

export type FeatType = 'Perk' | 'Flaw' | 'Pilot Trick' | 'Command Drill'

export interface Feat {
    name: string,
    type: FeatType
    effect: string
}

export interface Pilot {
    name: string
    trick: Feat
    rookie: boolean
}

export interface MAC {
    id: string
    name: string
    classification: 'MAC'
    class: number
    modules: ModuleConfig[]
    perks: Feat[]
    flaws: Feat[]
    pilot?: Pilot
}

export type AuxiliaryType = 'Infantry' | 'Vehicle'

export interface Auxiliary {
    name: string
    classification: 'Auxiliary unit'
    type: AuxiliaryType
    weapons: WeaponProfile[]
    hardware: HardwareProfile[]
}

export interface Formation {
    id: string
    size: number
    classification: 'Formation'
    unit: Auxiliary
}

export interface RemoteAsset {
    id: string
    name: string
    cost?: number
    effect?: string
    classification: 'Remote asset'
}

export type Entry = MAC | Formation | RemoteAsset

export interface RemoteAssetDefinition {
    key: string, // aka slug
    name: string,
    cost: number,
    effect: string,
}

export type VariantRule = 'Double Modules' | 'Critical Hits' | 'Hired Macs' | 'Perks & Flaws' | 'Remote Assets' | 'Pilot Tricks' | 'Command Drills'

/**
 * Represents a Force entity with its associated properties and rules.
 *
 * This interface defines the structure for a Force, including its unique identifier, associated entries,
 * point limit, faction, creation and update timestamps, command drill, and other descriptive or
 * customization-oriented attributes.
 */
export interface Force {

    id: string

    // essentials
    entries: Entry[]
    pointLimit: number
    faction?: string // aka the faction key

    createdAt: number
    updatedAt: number

    commandDrill?: Feat

    // flavour
    name: string
    description?: string
    symbol?: string // an avatar style icon to be displayed

    // mods and variants
    mods: VariantRule[]
}


export interface FactionRule {
    name: string
    description: string
}

export interface Faction {
    key: string
    name: string
    origin: string
    specialRule: FactionRule
    specialModule: HardwareModule
    sparks: string[]
    onAttach: Function
    onDetach: Function
}