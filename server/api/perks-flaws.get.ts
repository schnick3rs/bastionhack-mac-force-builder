import perksAndFlaws from "~~/server/data/perkFlawRepository";

export default defineEventHandler(async () => {
    return perksAndFlaws;
});
