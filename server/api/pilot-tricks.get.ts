import pilotTricks from "~~/server/data/pilotTrickRepository";

export default defineEventHandler(async () => {
    return pilotTricks;
});
