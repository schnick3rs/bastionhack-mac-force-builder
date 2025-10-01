
export type ModuleConfig =
    | { slot: number; type: 'Hardware'; double?: boolean; profile: HardwareProfile }
    | { slot: number; type: 'Weapon';  double?: boolean; profile: WeaponProfile }
    | { slot: number; type: 'Empty' }

export type Usability = 'MAC' | 'Infantry' | 'Vehicle' | 'All'

export interface HardwareModule {
    key: string,
    name: string,
    effect: string,
    usability: Usability[],
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


export interface MAC {
    id: string
    name: string
    classification: 'MAC'
    class: number
    modules: ModuleConfig[]
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
    classification: 'Remote asset'
}

export type Entry = MAC | Formation | RemoteAsset

export interface RemoteAssetDefinition {
    key: string, // aka slug
    name: string,
    cost: number,
    effect: string,
}

export interface Force {

    id: string

    // essentials
    entries: Entry[]
    pointLimit: number
    faction?: string

    // flavour
    name: string
    description?: string
    symbol?: string // an avatar style icon to be displayed

    // mods and variants
    mods?: string[]
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
}