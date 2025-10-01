import factions from "~~/server/data/factionRepository";

export default defineEventHandler(async (event) => {
    const factionKey = getRouterParam(event, 'factionKey')

    const faction = factions.find(f => f.key === factionKey)

    return faction;

});
