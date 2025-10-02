import hardware from "~~/server/data/hardwareRepository";
import factions from "~~/server/data/factionRepository";

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