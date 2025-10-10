import type {Faction, FactionRule, Force, HardwareModule} from "~~/types/unit";
import {createHardware} from "~~/server/data/hardwareRepository";

const factions: Faction[] = [];

const create = (
  name: string,
  origin: string,
  specialRule: FactionRule,
  specialModule: HardwareModule,
  sparks: string,
  onAttach: Function = () => {console.info('so be implemented')},
  onDetach: Function = () => {console.info('so be implemented')},
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
      onAttach,
      onDetach,
  };
};

factions.push(
    create(
        'Elder Circle',
        'Formerly HumanityFleet Mission Command',
        { name: 'Shock Dispersion', description: 'When one of your modules is damaged, lose 1 Heat. When one of your modules is destroyed, gain 1 Heat.'},
        createHardware('Rampart', 'Roll 2+ to ignore each hit to this module when it is undamaged.', ['MAC'], 'faction'),
        'ruthless,brutalist,mountainous,relentless',
    ),
    create(
        'Grand Forge',
        'Formerly HumanityFleet HeavyWare Development',
        { name: 'Hammer Forged', description: 'All brawl attacks by you and against you roll +1AD.'},
        createHardware('Extinguisher', 'In cooldown you may take a hit to this module to remove all Heat.', ['MAC'], 'faction'),
        'industrial,smoke,loud,reinforced'
    ),
    create(
        'First Regiment',
        'Formerly HumanityFleet Forward Security',
        { name: '0-Mods', description: 'MACs take an extra piece of hardware in the 0 slot. This module takes a hit whenever another module is destroyed. This can lead to internal damage if the 0-module has already been destroyed.'},
        createHardware('Seeker', 'Gain 1 Heat to give all your attacks -1TN this turn.', ['MAC'], 'faction'),
        'sleek, trophies, battlescars, horns',
        (force: Force) => {
            force.entries.filter(e => e.classification === 'MAC').forEach(entry => {
                entry.modules.unshift({ slot: 0, type: 'Empty'});
            })
        },
        (force: Force) => {
            force.entries.filter(e => e.classification === 'MAC').forEach(entry => {
                const index = entry.modules.findIndex(m => m.slot === 0);
                entry.modules.splice(index, 1);
            })
        }
    ),
    create(
        'Arksworn Order',
        'Formerly HumanityFleet Aeronaval Engineering',
        { name: 'Triple Hull', description: 'Your MACS treat their class as one higher for Heat generation, collisions, and internal damage capacity.'},
        createHardware('Spire', 'Short ranged power 1 weapon that has no type but can fire in any direction and does not generate Heat. Its power can never be increased.', ['MAC'], 'faction'),
        ' thrusters, baroque, naval, figureheads'
    ),
    create(
        'Torchbearer Archive',
        'Formerly HumanityFleet Data Administration',
        { name: 'Adaptive Architecture', description: 'When a module is destroyed increase the power of the main gun on that MAC by 1, with no limit.'},
        createHardware('Mindhive', 'When this unit activates, reveal the top card in the initiative deck then return it. You may then gain 1 Heat to shuffle the initiative deck.', ['All'], 'faction'),
        ' elegant, bright, intertwined, cruel'
    ),
    create(
        'Dynapolis Foresight',
        'Formerly HumanityFleet Outlook Mobility',
        { name: 'Temporal Overclocking', description: 'Once per turn, a MAC can reroll any number of attack dice, keeping the new results. Each rerolled die showing 1-3 causes 1 Heat to the MAC.'},
        createHardware('Halo', 'Destroy this module to ignore all hits from a single attack or other source.', ['All'], 'faction'),
        'flashy, chrome, neon, photogenic'
    ),
    create(
        'Vox Stellari',
        'Formerly HumanityFleet Comms Provider',
        { name: 'Harmonic Ratios', description: 'Your weapons with listed power equal to the current round number double their power for the duration of the round, before any other modifiers. ignoring power limits'},
        createHardware('Converter', 'Before each weapon attack you may change the subtype to Rad or Thermal.', ['All'], 'faction'),
        'psychedelic, spheres, prisms, asymmetry'
    ),
    create(
        'New Genesis',
        'Formerly HumanityFleet Terraforming Pioneers',
        { name: 'BioFusion', description: 'At the start of their move turn, MACs may rotate, move 3”, then rotate. When one of your modules is destroyed take an extra hit.'},
        createHardware('Spine', 'When you collide cause an extra hit and take one less hit than normal.', ['All'], 'faction'),
        'unsettling, wires, chitin, bladders'
    ),
    create(
        'Monolith Conclave',
        'Formerly HumanityFleet Civil Engineering Council',
        { name: 'Final Act', description: 'When a MAC is destroyed it causes hits equal to its class to all units in d6”. These hits are resolved before the meltdown phase ends.'},
        createHardware('Crucible', 'Lose 2 Heat in cooldown. When this module is hit gain 1 Rad.', ['MAC'], 'faction'),
        'unstable, banners, repurposed, crowns'
    ),
    create(
        'Skyless Cartel',
        'Formerly HumanityFleet Deep Mining Operation',
        { name: 'Umber Fields', description: 'When an attack fails to cause any hits to one of your MACs, increase its Motion by 1.'},
        createHardware('V-Drill', '+3AD in brawl vs MACs. Attack rolls of 1 cause a hit to the wielder. Maximum 2 per unit.', ['All'], 'faction'),
        'hunched, cutting, camouflage, sensors'
    ),
);

export default factions;