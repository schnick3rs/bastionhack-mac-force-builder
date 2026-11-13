import type {Feat} from "~~/types/unit";

/**
 * Pilot tricks (Pilot Tricks variant).
 * Set a number of notable pilots for each force, assign them to MACs, and give each a trick.
 */

const trick = (name: string, effect: string): Feat => ({ name, type: 'Pilot Trick', effect })

export const pilotTricks: Feat[] = [
    trick('Bullrush', 'You may move an extra 3” as long as you collide with an enemy.'),
    trick('Cruise', 'If you end your move turn on 1 Heat, lose that Heat.'),
    trick('Decoy', 'At the end of your move turn you may rotate the nearest visible enemy MAC to face you.'),
    trick('Hunker', 'When you hold you may set your Motion to any number.'),
    trick('Hustle', 'You may move an extra 3” as long as you start and end the move in cover.'),
    trick('Jink', 'You may move through enemy units without causing a collision.'),
    trick('Outmanoeuvre', 'At the end of your move you may adjust the Motion score of any one MAC by one. The target must be visible to you and within 6”.'),
    trick('Stalk', 'If you end your move turn out of line of sight of all enemies you may move an extra 3” in any direction and rotate.'),
]

export default pilotTricks
