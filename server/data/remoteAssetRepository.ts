import type {HardwareModule, RemoteAssetDefinition, Usability} from "~~/types/unit";

const remoteAssets: RemoteAssetDefinition[] = [];

export const createRemoteAsset = (
    name: string,
    effect: string,
    cost: number
): RemoteAssetDefinition => {
    return {
        key: name.toLowerCase().replace(/\s+/g, '-'), // example slug
        name,
        effect,
        cost
    }
}

remoteAssets.push(
    createRemoteAsset('Precision Strike', 'Target unit suffers d6 hits.', 2)
);

export default remoteAssets;