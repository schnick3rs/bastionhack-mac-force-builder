import type {RemoteAssetDefinition, RemoteAssetTag} from "~~/types/unit";

const remoteAssets: RemoteAssetDefinition[] = [];

export const createRemoteAsset = (
    name: string,
    effect: string,
    cost: number,
    tags: RemoteAssetTag[] = []
): RemoteAssetDefinition => {
    return {
        key: name.toLowerCase().replace(/\s+/g, '-'), // example slug
        name,
        effect,
        cost,
        tags,
    }
}

remoteAssets.push(
    createRemoteAsset(
        'Precision Strike',
        'Target unit suffers d6 hits.',
        2,
        ['attack']
    ),
    createRemoteAsset(
        'Carpet Bombing',
        'Target a point on the battlefield. All units within 6” suffer a single hit.',
        2,
        ['attack']
    ),
    createRemoteAsset(
        'Interface Hack',
        'Target MAC must make a system check or be hacked. When hacked, gain 1 Heat and adjust Motion by 1 if the attacker wishes.',
        1,
        ['control', 'heat']
    ),
    createRemoteAsset(
        'Target Tracker',
        'Target must pass a system check or else attackers treat the marked unit’s Motion as 1 for the rest of the round.',
        1,
        ['control']
    ),
    createRemoteAsset(
        'Ammunition Drone',
        'Restore one depleted X-type weapon to being fully loaded.',
        1,
        ['support']
    ),
    createRemoteAsset(
        'Shield Drop',
        'Mark the target. All attacks against them this round are at +1TN.',
        1,
        ['support']
    ),
    createRemoteAsset(
        'Redeployment Lifter',
        'Move an allied unit up to 9” in any direction, ignoring terrain. Rotate at the end of the move.',
        2,
        ['support']
    ),
    createRemoteAsset(
        'Disruption Burst',
        'Select a point on the battlefield. All units within 6” gain 1 Jolt.',
        2,
        ['attack']
    ),
    createRemoteAsset(
        'Micro Nuke',
        'Select a point on the battlefield. All units within 6” take 1 hit and 1 Rad.',
        3,
        ['attack']
    ),
    createRemoteAsset(
        'Gravity Well',
        'Select a point on the battlefield. All units within 6” are affected. Move each unit 3” directly toward the centre of the effect in an order of your choosing. Do not rotate. MACs can resist this by passing a system check.',
        2,
        ['control']
    ),
    createRemoteAsset(
        'Emergency Coolant',
        'Target loses d6 Heat.',
        2,
        ['heat', 'support']
    ),
    createRemoteAsset(
        'Total Bombardment',
        'All units that are not in cover or buildings suffer a single hit.',
        3,
        ['attack']
    ),
    createRemoteAsset(
        'Smoke Column',
        'Increase target’s Motion to 6.',
        1,
        ['support']
    ),
    createRemoteAsset(
        'Temporal Disruptor',
        'Take one initiative card already drawn this round and shuffle it back into the initiative deck.',
        2,
        ['control']
    ),
    createRemoteAsset(
        'Nanite Swarm',
        'Target unit rolls 3d6. Each die repairs the module number rolled, turning destroyed to damaged and damaged to undamaged.',
        1,
        ['support']
    ),
    createRemoteAsset(
        'Seismic Wave',
        'Target MAC must pass a system check or they crash.',
        1,
        ['control']
    ),
    createRemoteAsset(
        'Thermal Tick',
        'Target MAC must pass a system check or immediately set themselves to Heat 6.',
        1,
        ['control', 'heat']
    )
);

export default remoteAssets;