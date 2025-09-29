const commonHardware = [];

const create = (
  name: string,
  effect: string,
  restrictions: string[] = ['M', 'V', 'I']
) => {
  return {
      key: name.toLowerCase()                // make lowercase
          .trim()                       // remove leading/trailing spaces
          .replace(/[^a-z0-9\s-]/g, '') // remove special characters
          .replace(/\s+/g, '-')         // replace spaces with -
          .replace(/-+/g, '-'),
    type: 'hardware',
    name,
    effect,
    restrictions,
  };
};

commonHardware.push(
  create(
    'Aerodrive',
    'Ignore terrain when moving and checking line of sight both for and against you. Ignore collisions and brawl attacks. Your Motion is 3.',
    ['V']
  ),
  create(
    'Amplifier',
    'Before each attack, you may increase the power of the weapon being fired by 1, ignoring the normal limits.',
    ['M']
  ),
  create(
    'Armour',
    'Roll 5+ to ignore each hit. If this unit has two Armour modules, roll 3+ instead.',
    ['I', 'V']
  ),
  create(
    'Booster',
    'Once per attack turn, gain Heat equal to class to rotate then move up to 3”.'
  ),
  create(
    'Carrier',
    'Keep up to two infantry AUs off the board, noted as being inside this carrier. On their move activation they may deploy from their carrier unit. If the carrier is destroyed, all AUs inside are also destroyed. Deployed units cannot re-enter the carrier.',
    ['M', 'V']
  ),
  create(
    'Casing',
    'When you would take internal damage, hit this module instead.',
    ['M']
  ),
  create('Catalyst', 'Your first attack each turn generates 1 less Heat.', [
    'M',
  ]),
  create(
    'Cloak',
    'When you hold as your move, you may set Motion to 6. AUs can do this.',
    ['M']
  ),
  create(
    'Conductor',
    'At the end of your move turn, you may cause 1 Heat to a visible MAC within 3”.'
  ),
  create(
    'Coolant',
    'Lose 2 Heat in cooldown. When this module is destroyed gain 2 Heat.',
    ['M']
  ),
  create(
    'Disrutpr',
    'At the end of your move turn, you may force a visible MAC within 3” of you to pass a system check or crash.'
  ),
  create('Dozer', 'Count as 2 classes larger for collisions you cause.', ['V']),
  create('ECM', 'At the end of your attack turn, increase your Motion by 1.', [
    'M',
  ]),
  create(
    'Emitter',
    'At the end of your move turn, you may cause 1 Rad to a visible MAC within 3”.'
  ),
  create('Frame', 'Reduce cost by 1pt.', ['M']),
  create(
    'Gravlock',
    'At the end of your move turn, you may set your Motion to 1. AUs can do this.'
  ),
  create('Guardian', 'Lose 1 Rad and 1 Jolt in cooldown.', ['M']),
  create('Gyro', 'Move through rough and cover as open.'),
  create('Hooks', 'When a MAC you are touching moves, you may move with it.', [
    'I',
  ]),
  create(
    'Hotstepper',
    'When you jump and collide, cause an extra hit and 1 Heat to the target.'
  ),
  create('Hoverfoil', 'Move through rough and water as open.'),
  create('Intake', 'Jumping generates 1 less Heat.', ['M']),
  create('Jet', 'Each jet allows up to 9” of jumping.'),
  create(
    'Mesh',
    'If the attack caused fewer than 3 hits, ignore hits to this module.',
    ['M']
  ),
  create('Plate', 'Roll 4+ to ignore each hit to this module.', ['M']),
  create(
    'Precog',
    'When your initiative card is drawn, you may gain 1 Heat to shuffle it back into the deck instead of activating.',
    ['M']
  ),
  create(
    'Prism',
    'At the end of your attack turn, lose 1 Heat for each ranged weapon you fired.',
    ['M']
  ),
  create('Radiator', 'Lose 1 Heat in cooldown.', ['M']),
  create(
    'Reflector',
    'If the attack caused 3 or more hits, ignore hits to this module.',
    ['M']
  ),
  create('Rotor', 'Rotate an extra time at any point of your move.', ['M']),
  create('Servo', 'Gain 1 less Heat for shifting or rushing.', ['M']),
  create('Shield', 'Gain 1 Heat to ignore each hit to this module.', ['M']),
  create('Tether', 'At the end of your move turn, you may cause 1 Jolt to a visible MAC within 3”.'),
  create('Transport', 'This unit can rush.', ['I']),
  create('Vent', 'Lose 2 Heat when you hold in the move phase.', ['M']),
  
);

export default commonHardware;