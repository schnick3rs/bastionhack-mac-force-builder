import pilotTricks, {rookieTrick} from "~~/server/data/pilotTrickRepository";

export default defineEventHandler(async () => {
    return { tricks: pilotTricks, rookie: rookieTrick };
});
