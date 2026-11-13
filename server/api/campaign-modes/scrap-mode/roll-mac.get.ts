import {scrapChassisTable} from "~~/server/data/scrapModeRepository";
import {findPerkOrFlaw} from "~~/server/data/perkFlawRepository";
import {parseExampleWeapon} from "#shared/utils/examples";
import type {Feat, MAC, ModuleConfig} from "~~/types/unit";

/**
 * Rolls a random chassis for Scrap Mode (2d6).
 *
 * GET /api/campaign-modes/scrap-mode/roll-mac
 * GET /api/campaign-modes/scrap-mode/roll-mac?roll=7   (fixed result between 2 and 12, handy for testing)
 */
export default defineEventHandler((event) => {
    const query = getQuery(event)

    let dice: number[]
    if (query.roll !== undefined) {
        const roll = Number(query.roll)
        if (!Number.isInteger(roll) || roll < 2 || roll > 12) {
            throw createError({statusCode: 400, statusMessage: 'roll must be a whole number between 2 and 12'})
        }
        // split a forced total into two plausible dice
        const first = Math.min(6, roll - 1)
        dice = [first, roll - first]
    } else {
        dice = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]
    }
    const roll = dice[0]! + dice[1]!

    const chassis = scrapChassisTable.find(c => c.roll === roll)!

    // pre-installed modules first, the remaining slots stay empty (treated as frame modules)
    const modules: ModuleConfig[] = Array.from({length: 6}, (_, i): ModuleConfig => {
        const text = chassis.modules[i]
        if (!text) return {slot: i + 1, type: 'Empty'}
        const weapon = parseExampleWeapon(text)
        return weapon
            ? {slot: i + 1, type: 'Weapon', double: false, profile: weapon}
            : {slot: i + 1, type: 'Hardware', double: false, profile: {name: text}}
    })

    // wording of perks and flaws comes from the perk & flaw catalogue (p52)
    const perks: Feat[] = chassis.perk ? [findPerkOrFlaw(chassis.perk, 'Perk') ?? {name: chassis.perk, type: 'Perk', effect: ''}] : []
    const flaws: Feat[] = chassis.flaw ? [findPerkOrFlaw(chassis.flaw, 'Flaw') ?? {name: chassis.flaw, type: 'Flaw', effect: ''}] : []

    const mac: MAC = {
        id: crypto.randomUUID(),
        name: chassis.name,
        classification: 'MAC',
        class: chassis.class,
        modules,
        perks,
        flaws,
        pilot: undefined,
        division: undefined,
    }

    return {
        roll,
        dice,
        chassis: chassis.name,
        emptySlotsAreFrames: true,
        mac,
    }
})
