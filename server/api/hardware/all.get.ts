import commonHardware from "~~/server/data/hardwareRepository";
import factions from "~~/server/data/factionRepository";
import type {ModuleReference} from "~~/types/unit";

/** All common modules plus every faction's special module, as a reference. */
export default defineEventHandler((): ModuleReference[] => {
    const common = commonHardware.map(h => ({...h, faction: null}))
    const special = factions
        .filter(f => f.specialModule)
        .map(f => ({...f.specialModule, faction: {key: f.key, name: f.name}}))
    return [...common, ...special].sort((a, b) => a.name.localeCompare(b.name))
})
