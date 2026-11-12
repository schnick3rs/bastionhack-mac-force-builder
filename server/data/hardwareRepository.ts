import type {HardwareModule, HardwareTag, Origin, Usability} from "~~/types/unit";

const commonHardware: HardwareModule[] = [];

export const createHardware = (
    name: string,
    effect: string,
    usability: Usability[] = ['All'],
    origin: Origin = 'common',
    tags: HardwareTag[] = []
): HardwareModule => {
    return {
        key: name.toLowerCase().replace(/\s+/g, '-'), // example slug
        name,
        effect,
        usability: usability,
        origin: origin,
        tags,
    }
}

commonHardware.push(
  createHardware(
    'Aerodrive',
    'Ignore terrain when moving and checking line of sight both for and against you. Ignore collisions and brawl attacks. Your Motion is 3.',
    ['Vehicle'],
    'common',
    ['mobility']
  ),
  createHardware(
    'Amplifier',
    'Before each attack, you may increase the power of the weapon being fired by 1, ignoring the normal limits.',
    ['MAC'],
    'common',
    ['attack']
  ),
  createHardware(
    'Armour',
    'Roll 5+ to ignore each hit. If this unit has two Armour modules, roll 3+ instead.',
    ['Infantry', 'Vehicle'],
    'common',
    ['defense']
  ),
  createHardware(
    'Booster',
    'Once per attack turn, gain Heat equal to class to rotate then move up to 3”.',
    ['All'],
    'common',
    ['mobility']
  ),
  createHardware(
    'Carrier',
    'Keep up to two infantry AUs off the board, noted as being inside this carrier. On their move activation they may deploy from their carrier unit. If the carrier is destroyed, all AUs inside are also destroyed. Deployed units cannot re-enter the carrier.',
    ['MAC', 'Vehicle'],
    'common',
    ['utility']
  ),
  createHardware(
    'Casing',
    'When you would take internal damage, hit this module instead.',
    ['MAC'],
    'common',
    ['defense']
  ),
  createHardware(
    'Catalyst',
    'Your first attack each turn generates 1 less Heat.',
    [
    'MAC',
  ],
    'common',
    ['attack', 'heat']
  ),
  createHardware(
    'Cloak',
    'When you hold as your move, you may set Motion to 6. AUs can do this.',
    ['All'],
    'common',
    ['defense', 'mobility']
  ),
  createHardware(
    'Conductor',
    'At the end of your move turn, you may cause 1 Heat to a visible MAC within 3”.',
    ['All'],
    'common',
    ['attack']
  ),
  createHardware(
    'Coolant',
    'Lose 2 Heat in cooldown. When this module is destroyed gain 2 Heat.',
    ['MAC'],
    'common',
    ['utility', 'heat']
  ),
  createHardware(
    'Disruptor',
    'At the end of your move turn, you may force a visible MAC within 3” of you to pass a system check or crash.',
    ['All'],
    'common',
    ['attack']
  ),
  createHardware(
    'Dozer',
    'Count as 2 classes larger for collisions you cause.',
    ['Vehicle'],
    'common',
    ['attack']
  ),
  createHardware(
    'ECM',
    'At the end of your attack turn, increase your Motion by 1.',
    [
    'MAC',
  ],
    'common',
    ['defense']
  ),
  createHardware(
    'Emitter',
    'At the end of your move turn, you may cause 1 Rad to a visible MAC within 3”.',
    ['All'],
    'common',
    ['attack']
  ),
  createHardware(
    'Frame',
    'Reduce cost by 1pt.',
    ['MAC'],
    'common',
    ['utility']
  ),
  createHardware(
    'Gravlock',
    'At the end of your move turn, you may set your Motion to 1. AUs can do this.',
    ['All'],
    'common',
    ['utility']
  ),
  createHardware(
    'Guardian',
    'Lose 1 Rad and 1 Jolt in cooldown.',
    ['MAC'],
    'common',
    ['defense']
  ),
  createHardware(
    'Gyro',
    'Move through rough and cover as open.',
    ['All'],
    'common',
    ['mobility']
  ),
  createHardware(
    'Hooks',
    'When a MAC you are touching moves, you may move with it.',
    [
    'Infantry',
  ],
    'common',
    ['mobility']
  ),
  createHardware(
    'Hotstepper',
    'When you jump and collide, cause an extra hit and 1 Heat to the target.',
    ['All'],
    'common',
    ['attack', 'mobility']
  ),
  createHardware(
    'Hoverfoil',
    'Move through rough and water as open.',
    ['All'],
    'common',
    ['mobility']
  ),
  createHardware(
    'Intake',
    'Jumping generates 1 less Heat.',
    ['MAC'],
    'common',
    ['mobility', 'heat']
  ),
  createHardware(
    'Jet',
    'Each jet allows up to 9” of jumping.',
    ['All'],
    'common',
    ['mobility']
  ),
  createHardware(
    'Mesh',
    'If the attack caused fewer than 3 hits, ignore hits to this module.',
    ['MAC'],
    'common',
    ['defense']
  ),
  createHardware(
    'Plate',
    'Roll 4+ to ignore each hit to this module.',
    ['MAC'],
    'common',
    ['defense']
  ),
  createHardware(
    'Precog',
    'When your initiative card is drawn, you may gain 1 Heat to shuffle it back into the deck instead of activating.',
    ['MAC'],
    'common',
    ['utility']
  ),
  createHardware(
    'Prism',
    'At the end of your attack turn, lose 1 Heat for each ranged weapon you fired.',
    ['MAC'],
    'common',
    ['attack', 'heat']
  ),
  createHardware(
    'Radiator',
    'Lose 1 Heat in cooldown.',
    ['MAC'],
    'common',
    ['utility', 'heat']
  ),
  createHardware(
    'Reflector',
    'If the attack caused 3 or more hits, ignore hits to this module.',
    ['MAC'],
    'common',
    ['defense']
  ),
  createHardware(
    'Rotor',
    'Rotate an extra time at any point of your move.',
    ['MAC'],
    'common',
    ['mobility']
  ),
  createHardware(
    'Servo',
    'Gain 1 less Heat for shifting or rushing.',
    ['MAC'],
    'common',
    ['mobility', 'heat']
  ),
  createHardware(
    'Shield',
    'Gain 1 Heat to ignore each hit to this module.',
    ['MAC'],
    'common',
    ['defense', 'heat']
  ),
  createHardware(
    'Tether',
    'At the end of your move turn, you may cause 1 Jolt to a visible MAC within 3”.',
    ['All'],
    'common',
    ['attack']
  ),
  createHardware(
    'Transport',
    'This unit can rush.',
    ['Infantry'],
    'common',
    ['mobility']
  ),
  createHardware(
    'Vent',
    'Lose 2 Heat when you hold in the move phase.',
    ['MAC'],
    'common',
    ['utility', 'heat']
  ),
  
);

export default commonHardware;