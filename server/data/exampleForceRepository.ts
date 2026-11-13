/**
 * Example forces per faction (taken from the faction example forces of the army book).
 *
 * Weapons are written in the usual code notation `<range><type><power>[-<subtype>][X] <name>`,
 * e.g. "SB3 ThunderGun", "AB2-JX ShockPods" or "B2 Claw" (brawl weapons have no range letter).
 * Everything else is treated as hardware and has to exist in the hardware catalogue.
 */

export interface ExampleMac {
    name: string
    class: 1 | 2 | 3
    /** modules of slot 1 to 6 */
    modules: string[]
    /** module in slot 0, only for factions with the 0-slot rule */
    zero?: string
    /** points as printed in the army book, used to double check the data */
    pts: number
}

export interface ExampleFormation {
    name: string
    size: number
    type: 'Vehicle' | 'Infantry'
    weapons: string[]
    hardware: string[]
    pts: number
}

export interface ExampleForce {
    macs: ExampleMac[]
    formations: ExampleFormation[]
}

const examples: Record<string, ExampleForce> = {

    'arksworn-order': {
        macs: [
            { name: 'The Reaper', class: 2, pts: 16, modules: ['LP3 Repulser', 'AB2-JX ShockPods', 'AB2-JX ShockPods', 'Cloak', 'Coolant', 'Servo'] },
            { name: 'The Hierophant', class: 2, pts: 16, modules: ['SB3 ReaperGun', 'Spire', 'Spire', 'Spire', 'Coolant', 'Servo'] },
            { name: 'The Empress', class: 3, pts: 20, modules: ['LP4 Annihilator', 'LM3 AssaultCannon', 'Spire', 'Spire', 'Coolant', 'Servo'] },
        ],
        formations: [
            { name: 'Cutter', size: 2, type: 'Vehicle', pts: 8, weapons: ['LB2 AutoCannon'], hardware: ['Hoverfoil'] },
            { name: 'Ironclad', size: 2, type: 'Vehicle', pts: 8, weapons: ['SB1-J Shocker'], hardware: ['Armour', 'Gyro'] },
            { name: 'Skimmer-Dragoons', size: 2, type: 'Infantry', pts: 8, weapons: ['SP1 Pulser'], hardware: ['Hoverfoil', 'Transport'] },
        ],
    },

    'grand-forge': {
        macs: [
            { name: 'The Terminatrix', class: 2, pts: 16, modules: ['SP3 PulseBeam', 'SM2-X SwarmRockets', 'SM2-X SwarmRockets', 'Servo', 'Servo', 'Gyro'] },
            { name: 'The Sledgehammer', class: 3, pts: 20, modules: ['SB3-T Incinerator', 'LB3 MacroCannon', 'AB2-RX RadMissiles', 'Extinguisher', 'Extinguisher', 'Shield'] },
        ],
        formations: [
            { name: 'Fortress', size: 2, type: 'Vehicle', pts: 10, weapons: ['AB2 Howitzer'], hardware: ['Armour', 'Armour'] },
            { name: 'Overlord', size: 1, type: 'Vehicle', pts: 8, weapons: ['SB2 StormCannon'], hardware: ['Aerodrive', 'Armour', 'Armour', 'Carrier', 'Carrier'] },
            { name: 'Ripper', size: 2, type: 'Vehicle', pts: 8, weapons: ['B2 Blade'], hardware: ['Armour', 'Gyro'] },
            { name: 'Besiegers', size: 3, type: 'Infantry', pts: 15, weapons: ['SP1-X DemoCharges', 'P2 Piston'], hardware: ['Armour', 'Jet'] },
        ],
    },

    'new-genesis': {
        macs: [
            { name: 'The Serpent', class: 2, pts: 16, modules: ['SB2-T FireBreath', 'SB2-T FireBreath', 'P2 Spike', 'Spine', 'Spine', 'Jet'] },
            { name: 'The Domination', class: 3, pts: 20, modules: ['AB3-R Spores', 'SP2-X Stinger', 'SP2-X Stinger', 'B2 Claw', 'Spine', 'Carrier'] },
            { name: 'The Roach', class: 1, pts: 12, modules: ['B2 Claw', 'B2 Claw', 'Spine', 'Spine', 'Tether', 'Mesh'] },
        ],
        formations: [
            { name: 'Wyrm', size: 3, type: 'Vehicle', pts: 12, weapons: ['SB1-T FireBreath'], hardware: ['Gyro', 'Tether'] },
            { name: 'Warriors', size: 5, type: 'Infantry', pts: 15, weapons: ['B2 Blade'], hardware: ['Hooks'] },
        ],
    },

    'first-regiment': {
        macs: [
            { name: 'The Killing Arrow', class: 2, pts: 16, zero: 'Seeker', modules: ['SP2 IonBeam', 'SP2 IonBeam', 'SP1 PulseBeam', 'SP1 PulseBeam', 'Coolant', 'Coolant'] },
            { name: 'The Bloody Tiger', class: 3, pts: 20, zero: 'ECM', modules: ['AG2-JX ShockMissiles', 'AG2-JX ShockMissiles', 'LG2 SmartAccelerator', 'LG2 SmartAccelerator', 'SP3-X BreakerBombs', 'Coolant'] },
        ],
        formations: [
            { name: 'Warthog', size: 1, type: 'Vehicle', pts: 4, weapons: ['SB1-X Bombs'], hardware: ['Hoverfoil', 'Carrier'] },
            { name: 'Micro-MAC', size: 2, type: 'Vehicle', pts: 12, weapons: ['SB2 Cannon', 'P2 Piston'], hardware: ['Armour', 'Gyro'] },
            { name: 'Supersoldiers', size: 3, type: 'Infantry', pts: 12, weapons: ['SP1 LaserCarbine'], hardware: ['Armour', 'Hooks'] },
            { name: 'Cadets', size: 5, type: 'Infantry', pts: 10, weapons: ['SP1 LaserCarbine'], hardware: [] },
        ],
    },

    'elder-circle': {
        macs: [
            { name: 'The Olympus', class: 3, pts: 20, modules: ['SB3 ThunderGun', 'SB2-T Burner', 'LB1-X RocketPod', 'Guardian', 'Rampart', 'Rampart'] },
            { name: 'The Centurion', class: 2, pts: 16, modules: ['LB3 MegaCannon', 'Amplifier', 'Amplifier', 'Vent', 'Rampart', 'Rampart'] },
            { name: 'The Pillbug', class: 1, pts: 10, modules: ['SB2 StormGun', 'SB1-X Grenades', 'Frame', 'Frame', 'Rampart', 'Rampart'] },
        ],
        formations: [
            { name: 'Sabretooth', size: 3, type: 'Vehicle', pts: 12, weapons: ['SB1-T Burner'], hardware: ['Armour', 'Dozer'] },
            { name: 'Mastodon', size: 3, type: 'Vehicle', pts: 15, weapons: ['LM2 TwinCannons'], hardware: ['Armour', 'Armour'] },
        ],
    },

    'dynapolis-foresight': {
        macs: [
            { name: 'The Vantage', class: 2, pts: 14, modules: ['AP2-J ShockOrb', 'AG2-X HunterMissile', 'SM1 FlashGun', 'Jet', 'Frame', 'Frame'] },
            { name: 'The Execution', class: 3, pts: 20, modules: ['SP3-R GammaLance', 'LB1-X SonicRockets', 'LB1-X SonicRockets', 'B2 Blade', 'Radiator', 'Halo'] },
        ],
        formations: [
            { name: 'Dragonet', size: 3, type: 'Vehicle', pts: 6, weapons: [], hardware: ['Booster'] },
            { name: 'Milipede', size: 3, type: 'Vehicle', pts: 9, weapons: [], hardware: ['Dozer', 'Halo'] },
            { name: 'Firebird', size: 2, type: 'Vehicle', pts: 10, weapons: ['SB2-T Burner'], hardware: ['Aerodrive', 'Halo'] },
            { name: 'Scions', size: 4, type: 'Infantry', pts: 16, weapons: ['P2 Piston'], hardware: ['Booster', 'Halo'] },
        ],
    },

    'monolith-conclave': {
        macs: [
            { name: 'The Magpie', class: 2, pts: 15, modules: ['LB2 Cannon', 'SB1 StormGun', 'SB1 StormGun', 'SB1 StormGun', 'Crucible', 'Frame'] },
            { name: 'The Claymore', class: 3, pts: 20, modules: ['SB4 ThunderCannon', 'LP2-X RocketPod', 'Intake', 'Intake', 'Hotstepper', 'Jet'] },
            { name: 'The Sparrow', class: 1, pts: 10, modules: ['SB2-X ClusterBombs', 'SB1 StormGun', 'Amplifier', 'Crucible', 'Frame', 'Frame'] },
        ],
        formations: [
            { name: 'Avenger', size: 3, type: 'Vehicle', pts: 18, weapons: ['LP2-X Rockets', 'LP2-X Rockets'], hardware: ['Dozer'] },
            { name: 'Templars', size: 4, type: 'Infantry', pts: 12, weapons: ['SP1-X FusionBombs', 'B2 Blades'], hardware: [] },
        ],
    },

    'skyless-cartel': {
        macs: [
            { name: 'The Black Lobster', class: 3, pts: 20, modules: ['SB3 ThunderGun', 'SB3 ThunderGun', 'Coolant', 'Guardian', 'Mesh', 'Mesh'] },
            { name: 'The Gremlin', class: 1, pts: 11, modules: ['LP2 Repulsor', 'Amplifier', 'Amplifier', 'Catalyst', 'Catalyst', 'Frame'] },
            { name: 'The Cricket', class: 1, pts: 10, modules: ['V-Drill', 'V-Drill', 'Booster', 'Booster', 'Frame', 'Frame'] },
        ],
        formations: [
            { name: 'Prowler', size: 3, type: 'Vehicle', pts: 9, weapons: ['LP1 Railgun'], hardware: ['V-Drill'] },
            { name: 'Abyssals', size: 3, type: 'Infantry', pts: 15, weapons: ['LB1 Blaster', 'SP1 Pulser'], hardware: ['Armour', 'Armour'] },
            { name: 'Miners', size: 5, type: 'Infantry', pts: 10, weapons: [], hardware: ['V-Drill'] },
        ],
    },

    'torchbearer-archive': {
        macs: [
            { name: 'The Ivory Tower', class: 2, pts: 16, modules: ['LB2 AutoCannon', 'LB2 AutoCannon', 'SP1-R AlphaBeam', 'SP1-R AlphaBeam', 'Coolant', 'Mindhive'] },
            { name: 'The Green Knight', class: 3, pts: 20, modules: ['LP3-R GammaLance', 'SM2 LaserMatrix', 'SM2 LaserMatrix', 'P2 Piston', 'Coolant', 'Shield'] },
            { name: 'The Rising Ape', class: 1, pts: 12, modules: ['LG2-X RocketPod', 'AG1-X SeekerMissiles', 'AG1-JX ShockMissiles', 'AG1-TX PlasmaMissiles', 'Coolant', 'Mindhive'] },
        ],
        formations: [
            { name: 'Golem', size: 3, type: 'Vehicle', pts: 12, weapons: ['LP1 PlasmaGun'], hardware: ['Armour', 'Gyro'] },
            { name: 'Lightning Jar', size: 3, type: 'Vehicle', pts: 12, weapons: ['AP2-J BoltCaster'], hardware: ['Mindhive'] },
        ],
    },

    'vox-stellari': {
        macs: [
            { name: 'The Radical', class: 2, pts: 16, modules: ['LP3-R GammaLance', 'AB2-X BlastMissiles', 'AB2-X BlastMissiles', 'Coolant', 'Cloak', 'Precog'] },
            { name: 'The Dissonance', class: 3, pts: 20, modules: ['LP3 Repulsor', 'LG2 SmartCannon', 'Converter', 'Reflector', 'Coolant', 'Shield'] },
            { name: 'The Ignition', class: 1, pts: 12, modules: ['SG2 SmartRay', 'SP1-T HeatRay', 'Booster', 'Amplifier', 'Coolant', 'Coolant'] },
        ],
        formations: [
            { name: 'Lancer', size: 3, type: 'Vehicle', pts: 9, weapons: ['LP2-R GammaRay'], hardware: [] },
            { name: 'Nightmare', size: 3, type: 'Vehicle', pts: 6, weapons: [], hardware: ['Cloak'] },
            { name: 'Observers', size: 4, type: 'Infantry', pts: 12, weapons: ['LG1 ProbeRifle'], hardware: ['Cloak'] },
        ],
    },
}

export default examples;
