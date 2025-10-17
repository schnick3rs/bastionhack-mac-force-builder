import {buildWeaponDisplayString} from "#shared/utils/weapons";
import hardware from "~~/server/data/hardwareRepository";
import factions from "~~/server/data/factionRepository";
import type {HardwareModule, HardwareProfile, ModuleConfig, WeaponProfile} from "~~/types/unit";

export function getHardwareCatalogue(factionKey: string | undefined = undefined) {

    const hardwareList = [...hardware];

    if (factionKey) {
        const faction = factions.find((f) => f.key === factionKey)
        const factionHardware = faction?.specialModule || null;
        if (factionHardware) {
            hardwareList.push(factionHardware)
            hardwareList.sort((a, b) => {
                return a.name.localeCompare(b.name)
            });
        }
    }
    return hardwareList;
}

export function getHardwareByName(name: string):  HardwareModule | undefined {
    return hardware.find((h) => h.name === name);
}

export type Niceware = { name: string, count: number }

export function convertToNiceware(modules: HardwareProfile[]) {
    const niceware: Niceware[] = Object.values(
        modules.reduce<Record<string, Niceware>>((acc, { name }) => {
            if (!acc[name]) {
                acc[name] = { name, count: 0 }
            }
            acc[name].count++
            return acc
        }, {})
    )
    return niceware;
}

export type ReducedModule =
    | { name: string; count: number; type: 'Hardware'; profile: HardwareProfile }
    | { name: string; count: number; type: 'Weapon';  profile: WeaponProfile }

export function reduceModules(modules: ModuleConfig[]): ReducedModule[] {
    const map = new Map<string, ReducedModule>()

    for (const mod of modules) {
        if (mod.type === 'Empty') continue

        let name: string
        if (mod.type === 'Hardware') {
            name = mod.profile.name
        } else if (mod.type === 'Weapon') {
            name = buildWeaponDisplayString(mod.profile)
        } else {
            continue
        }

        const count = mod.double ? 2 : 1

        if (map.has(name)) {
            map.get(name)!.count += count
        } else {
            if (mod.type === 'Hardware') {
                map.set(name, {
                    name,
                    count,
                    type: mod.type,
                    profile: mod.profile,
                })
            } else {
                map.set(name, {
                    name,
                    count,
                    type: mod.type,
                    profile: mod.profile,
                })
            }

        }
    }

    return Array.from(map.values())
}