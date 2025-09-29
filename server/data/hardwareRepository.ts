import type {HardwareModule, Usability} from "~~/types/unit";

const commonHardware: HardwareModule[] = [];

export const create = (
    name: string,
    effect: string,
    usability: Usability[] = ['All']
): HardwareModule => {
    return {
        key: name.toLowerCase().replace(/\s+/g, '-'), // example slug
        name,
        effect,
        usability: usability,
    }
}

commonHardware.push(
  create(
    'Aerodrive',
    'Ignore terrain when moving and checking line of sight both for and against you. Ignore collisions and brawl attacks. Your Motion is 3.',
    ['Vehicle']
  ),
  create(
    'Amplifier',
    'Before each attack, you may increase the power of the weapon being fired by 1, ignoring the normal limits.',
    ['MAC']
  ),
  create(
    'Armour',
    'Roll 5+ to ignore each hit. If this unit has two Armour modules, roll 3+ instead.',
    ['Infantry', 'Vehicle']
  ),
  create(
    'Booster',
    'Once per attack turn, gain Heat equal to class to rotate then move up to 3”.'
  ),
  create(
    'Carrier',
    'Keep up to two infantry AUs off the board, noted as being inside this carrier. On their move activation they may deploy from their carrier unit. If the carrier is destroyed, all AUs inside are also destroyed. Deployed units cannot re-enter the carrier.',
    ['MAC', 'Vehicle']
  ),
  create(
    'Casing',
    'When you would take internal damage, hit this module instead.',
    ['MAC']
  ),
  create('Catalyst', 'Your first attack each turn generates 1 less Heat.', [
    'MAC',
  ]),
  create(
    'Cloak',
    'When you hold as your move, you may set Motion to 6. AUs can do this.',
    ['MAC']
  ),
  create(
    'Conductor',
    'At the end of your move turn, you may cause 1 Heat to a visible MAC within 3”.'
  ),
  create(
    'Coolant',
    'Lose 2 Heat in cooldown. When this module is destroyed gain 2 Heat.',
    ['MAC']
  ),
  create(
    'Disrutpr',
    'At the end of your move turn, you may force a visible MAC within 3” of you to pass a system check or crash.'
  ),
  create('Dozer', 'Count as 2 classes larger for collisions you cause.', ['Vehicle']),
  create('ECM', 'At the end of your attack turn, increase your Motion by 1.', [
    'MAC',
  ]),
  create(
    'Emitter',
    'At the end of your move turn, you may cause 1 Rad to a visible MAC within 3”.'
  ),
  create('Frame', 'Reduce cost by 1pt.', ['MAC']),
  create(
    'Gravlock',
    'At the end of your move turn, you may set your Motion to 1. AUs can do this.'
  ),
  create('Guardian', 'Lose 1 Rad and 1 Jolt in cooldown.', ['MAC']),
  create('Gyro', 'Move through rough and cover as open.'),
  create('Hooks', 'When a MAC you are touching moves, you may move with it.', [
    'Infantry',
  ]),
  create(
    'Hotstepper',
    'When you jump and collide, cause an extra hit and 1 Heat to the target.'
  ),
  create('Hoverfoil', 'Move through rough and water as open.'),
  create('Intake', 'Jumping generates 1 less Heat.', ['MAC']),
  create('Jet', 'Each jet allows up to 9” of jumping.'),
  create(
    'Mesh',
    'If the attack caused fewer than 3 hits, ignore hits to this module.',
    ['MAC']
  ),
  create('Plate', 'Roll 4+ to ignore each hit to this module.', ['MAC']),
  create(
    'Precog',
    'When your initiative card is drawn, you may gain 1 Heat to shuffle it back into the deck instead of activating.',
    ['MAC']
  ),
  create(
    'Prism',
    'At the end of your attack turn, lose 1 Heat for each ranged weapon you fired.',
    ['MAC']
  ),
  create('Radiator', 'Lose 1 Heat in cooldown.', ['MAC']),
  create(
    'Reflector',
    'If the attack caused 3 or more hits, ignore hits to this module.',
    ['MAC']
  ),
  create('Rotor', 'Rotate an extra time at any point of your move.', ['MAC']),
  create('Servo', 'Gain 1 less Heat for shifting or rushing.', ['MAC']),
  create('Shield', 'Gain 1 Heat to ignore each hit to this module.', ['MAC']),
  create('Tether', 'At the end of your move turn, you may cause 1 Jolt to a visible MAC within 3”.'),
  create('Transport', 'This unit can rush.', ['Infantry']),
  create('Vent', 'Lose 2 Heat when you hold in the move phase.', ['MAC']),
  
);

export default commonHardware;