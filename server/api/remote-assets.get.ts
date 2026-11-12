import remoteAssets from "~~/server/data/remoteAssetRepository";

export default defineEventHandler(async () => {
    return remoteAssets;
});
