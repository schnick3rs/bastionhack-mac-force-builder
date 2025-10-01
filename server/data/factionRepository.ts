import type {Faction, FactionRule, HardwareModule} from "~~/types/unit";
import {createHardware} from "~~/server/data/hardwareRepository";

const factions: Faction[] = [];

const create = (
  name: string,
  origin: string,
  specialRule: FactionRule,
  specialModule: HardwareModule,
  sparks: string
) => {
  return {
      key: name.toLowerCase()                // make lowercase
          .trim()                       // remove leading/trailing spaces
          .replace(/[^a-z0-9\s-]/g, '') // remove special characters
          .replace(/\s+/g, '-')         // replace spaces with -
          .replace(/-+/g, '-'),
      name,
      origin,
      specialRule,
      specialModule,
      sparks: sparks.split(',').map(s => s.trim()),
  };
};

factions.push(
    create(
        'Elder Circle',
        'Formerly HumanityFleet Mission Command',
        { name: 'Shock Dispersion', description: 'When one of your modules is damaged, lose 1 Heat. When one of your modules is destroyed, gain 1 Heat.'},
        createHardware('Rampart', 'Roll 2+ to ignore each hit to this module when it is undamaged.', ['MAC']),
        'ruthless,brutalist,mountainous,relentless'
    ),
    create(
        'Grand Forge',
        'Formerly HumanityFleet HeavyWare Development',
        { name: 'Hammer Forged', description: 'All brawl attacks by you and against you roll +1AD.'},
        createHardware('Extinguisher', 'In cooldown you may take a hit to this module to remove all Heat.', ['MAC']),
        'industrial,smoke,loud,reinforced'
    ),
    create(
        'First Regiment',
        'Formerly HumanityFleet Forward Security',
        { name: '', description: ''},
        createHardware('', '', ['MAC']),
        'sleek, trophies, battlescars, horns'
    ),
    create(
        'Arksworn Order',
        'Formerly HumanityFleet Aeronaval Engineering',
        { name: 'Triple Hull', description: ''},
        createHardware('Spire', '', ['MAC']),
        ' thrusters, baroque, naval, figureheads'
    ),
    create(
        'Torchbearer Archive',
        'Formerly HumanityFleet Data Administration',
        { name: 'Adaptive Architecture', description: ''},
        createHardware('Mindhive', '', ['All']),
        ' elegant, bright, intertwined, cruel'
    ),
    create(
        'Dynapolis Forsight',
        'Formerly HumanityFleet Outlook Mobility',
        { name: 'Temporal Overclocking', description: ''},
        createHardware('Halo', '', ['All']),
        'flashy, chrome, neon, photogenic'
    ),
    create(
        'Vox Stellari',
        'Formerly HumanityFleet Comms Provider',
        { name: 'Harmonic Ratios', description: ''},
        createHardware('Converter', '', ['All']),
        'psychedelic, spheres, prisms, asymmetry'
    ),
    create(
        'New Genesis',
        'Formerly HumanityFleet Terraforming Pioneers',
        { name: 'BioFusion', description: ''},
        createHardware('Spine', '', ['All']),
        'unsettling, wires, chitin, bladders'
    ),
    create(
        'Monolith Conclave',
        'Formerly HumanityFleet Civil Engineering Council',
        { name: 'Final Act', description: ''},
        createHardware('Crucible', '', ['MAC']),
        'unstable, banners, repurposed, crowns'
    ),
    create(
        'Skyless Cartel',
        'Formerly HumanityFleet Deep Mining Operation',
        { name: 'Umber Fields', description: ''},
        createHardware('V-Drill', '+3AD in brawl vs MACs. Attack rolls of 1 cause a hit to the wielder. Maximum 2 per unit.', ['All']),
        'hunched, cutting, camouflage, sensors'
    ),
);

export default factions;