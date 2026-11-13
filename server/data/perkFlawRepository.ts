import type {Feat} from "~~/types/unit";

/**
 * Perks and flaws (Perks & Flaws variant, p52).
 * Players agree how many each player assigns to their MACs, and do not take perks and flaws
 * that cancel each other out or contradict each other.
 */

const create = (type: 'Perk' | 'Flaw', name: string, effect: string): Feat => ({ name, type, effect })

const perk = (name: string, effect: string) => create('Perk', name, effect)
const flaw = (name: string, effect: string) => create('Flaw', name, effect)

export const perks: Feat[] = [
    perk('Agile', 'You may rotate at the end of a rush move.'),
    perk('Airy', 'Roll each time a point of Heat is lost. On a 5 or 6, lose an extra point of Heat.'),
    perk('Aware', 'When you attack, your front facing is 270°.'),
    perk('Bruiser', 'Brawls against you roll -1AD.'),
    perk('Cool', 'When you would end the meltdown phase on 1 Heat, lose 1 Heat.'),
    perk('Focused', 'Attacks against targets with Motion 2 or less get -1TN.'),
    perk('Intimidating', 'Attacks against you within 6” get +1TN.'),
    perk('Keen', 'Attacks against targets with Motion 3 or higher get -1TN.'),
    perk('Marathon', 'Gain 1 less Heat when rushing.'),
    perk('Momentum', 'At the start of your move turn you may move forward up to 3” without gaining any Heat.'),
    perk('Pragmatic', 'Lose 1 Heat when a module is destroyed.'),
    perk('Protective', 'When your main gun is hit, you may reroll that hit location once.'),
    perk('Redline', 'When you set Heat to exactly 6, with no overheat, immediately lose 1 Heat.'),
    perk('Sprinter', 'Rush up to 15”.'),
    perk('Stealthy', 'When you deploy, adjust your position by 6” without gaining Heat.'),
    perk('Strider', 'Shift up to 9”.'),
    perk('Sturdy', 'Attacks to your front get +1TN.'),
    perk('Survivor', 'When you have enough internal damage to be destroyed in the meltdown phase, roll d6. On a 5+ you are not destroyed.'),
    perk('Wild', 'Roll a die at the start of your attack turn. On a 6 you immediately lose all Heat.'),
]

export const flaws: Feat[] = [
    flaw('Awkward', 'Gain 1 extra Heat when shifting.'),
    flaw('Blinkered', 'When you attack, your front facing is only 90°.'),
    flaw('Brittle', 'When you crash, take hits equal to your class.'),
    flaw('Buggy', 'Roll a die at the start of your move turn. On a roll of 1 you do nothing this phase.'),
    flaw('Capped', 'Only move up to 9” when rushing.'),
    flaw('Combustible', 'Overheating causes internal damage instead of hits.'),
    flaw('Cumbersome', 'Do not rotate at the end of a shift move.'),
    flaw('Deadmeat', 'Attacks against you get -1TN.'),
    flaw('Deathtrap', 'Take 1 internal damage when the main gun is destroyed.'),
    flaw('Explosive', 'When you have internal damage equal or higher than your class, you are destroyed immediately.'),
    flaw('Exposed', 'Your main gun is destroyed in a single hit.'),
    flaw('Frail', 'Brawls against you roll twice as many AD.'),
    flaw('Frontloaded', 'Hits to your rear cause an extra hit each. Weapon effects are applied normally to these extra hits.'),
    flaw('Jamming', 'Roll a die when you activate in the attack phase. On a roll of 1 your turn ends.'),
    flaw('Lag', 'Attacks against targets with Motion 3 or higher get +1TN.'),
    flaw('Locked', 'When you rush, you cannot rotate before the move.'),
    flaw('Recoil', '+1TN with your main gun.'),
    flaw('Stiff', 'Gain 1 extra Heat when rushing.'),
    flaw('Stuffy', 'Roll each time a point of Heat would be lost. On a 1 or 2, it is not lost.'),
    flaw('Sway', 'Test for a crash when taking 2 hits from an attack.'),
    flaw('Toasty', 'Start with 1 Heat and never go below 1 Heat.'),
    flaw('Twitchy', 'Attacks against targets with Motion 2 or less get +1TN.'),
]

export function findPerkOrFlaw(name: string, type?: 'Perk' | 'Flaw'): Feat | undefined {
    const list = type === 'Perk' ? perks : type === 'Flaw' ? flaws : [...perks, ...flaws]
    return list.find(f => f.name === name)
}

export default { perks, flaws }
