import hardware from "~~/server/data/hardwareRepository";
import factions from "~~/server/data/factionRepository";
import type {HardwareProfile} from "~~/types/unit";

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
