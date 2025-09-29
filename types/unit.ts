
export type UnitType = 'MAC' | 'Infantry' | 'Vehicle' | 'Remote Asset'

export type ModuleType = 'Hardware' | 'Weapon'

export type Restriction = 'MacOnly' | 'InfantryOnly' | 'VehicleOnly' | 'NoRestrictions'

export type ModuleConfig =
    | { slot?: number; type: 'Hardware'; profile: HardwareModule }
    | { slot?: number; type: 'Weapon'; profile: WeaponModule }

export interface HardwareModule {
    slug: string,
     name: string,
     effect: string,
     restrictions: Restriction[]
}

export type WeaponRange = 'Brawl' | 'Short' | 'Long' | 'Arc'
export type WeaponType = 'Burst' | 'Piercing' | 'Guided' | 'Multi'

export interface WeaponModule {
    range: WeaponRange,
    type: WeaponType,
    power: number,

}

export interface Unit {
    id: string, // a UUID probably
    name: string,
    type: UnitType,
    modules: ModuleConfig[],
}

export interface MAC extends Unit {
    type: 'MAC',
    class: number, // a MACs weight class
}

export interface Infantry extends Unit {
    type: 'Infantry',
    size: number, // a formations number of bases
}

export interface Vehicle extends Unit {
    type: 'Vehicle',
    size: number, // a formations number of bases
}