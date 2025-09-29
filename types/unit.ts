
export type ModuleConfig =
    | { slot?: number; type: 'Hardware'; profile: HardwareModule }
    | { slot?: number; type: 'Weapon'; profile: WeaponModule }

export type Usability = 'MAC' | 'Infantry' | 'Vehicle' | 'All'

export interface HardwareModule {
    key: string,
    name: string,
    effect: string,
    usability: Usability[],
}

export type WeaponRange = 'Brawl' | 'Short' | 'Long' | 'Arc'
export type WeaponType = 'Burst' | 'Piercing' | 'Guided' | 'Multi'
export type WeaponSubtype = 'Thermal' | 'Jolt' | 'Radiation'

export interface WeaponModule {
    range: WeaponRange,
    type: WeaponType,
    subType: WeaponSubtype | null,
    expendable: false,
    power: number,
    label: string,
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
    modules: ModuleConfig[]
}

export interface Formation {
    id: string
    size: number
    classification: 'Formation'
    unit: Auxiliary
}

export type Entry = MAC | Formation

export interface Force {
    id: string
    name: string
    entries: Entry[]
    description?: string
    pointLimit: number
    faction?: string
    mods?: string[]
}

export interface Faction {
    key: string
    name: string
    origin: string
    specialRule: string
    specialModule: string
    sparks: string[]
}