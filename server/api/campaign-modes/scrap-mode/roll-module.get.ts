import {
    civilianHardwareTable,
    militaryHardwareTable,
    randomScrapWeaponName,
    scrapWeaponPower,
    scrapWeaponRange,
    scrapWeaponSecondSubtype,
    scrapWeaponSubtype,
    scrapWeaponType,
} from "~~/server/data/scrapModeRepository";
import {parseExampleWeapon} from "#shared/utils/examples";
import {buildWeaponDisplayString, rangeMap, subtypeMap, typeMap} from "#shared/utils/weapons";
import type {WeaponProfile, WeaponSubtype} from "~~/types/unit";

type RolledModule =
    | { type: 'Weapon', label: string, profile: WeaponProfile }
    | { type: 'Hardware', label: string, profile: { name: string } }

const d6 = () => 1 + Math.floor(Math.random() * 6)

function hardwareOption(text: string): RolledModule {
    // brawl weapons are part of the hardware tables (M2 Mower, P2 Piston, B2 Blade, G2 Grapple)
    const weapon = parseExampleWeapon(text)
    if (weapon) return {type: 'Weapon', label: buildWeaponDisplayString(weapon), profile: weapon}
    return {type: 'Hardware', label: text, profile: {name: text}}
}

/**
 * Rolls a random module for Scrap Mode.
 *
 * GET /api/campaign-modes/scrap-mode/roll-module
 * GET /api/campaign-modes/scrap-mode/roll-module?roll=3   (fixed d6 for the module category, 1-6, handy for testing)
 *
 * d6: 1-2 weapon (no subtype), 3 weapon (with subtype), 4-5 civilian hardware, 6 military hardware.
 * Where the table says "X or Y" the response lists both in `options`, `module` is one of them picked at random.
 */
export default defineEventHandler((event) => {
    const query = getQuery(event)

    let categoryRoll = d6()
    if (query.roll !== undefined) {
        categoryRoll = Number(query.roll)
        if (!Number.isInteger(categoryRoll) || categoryRoll < 1 || categoryRoll > 6) {
            throw createError({statusCode: 400, statusMessage: 'roll must be a whole number between 1 and 6'})
        }
    }

    // --- hardware ------------------------------------------------------------------------------
    if (categoryRoll >= 4) {
        const military = categoryRoll === 6
        const dice = [d6(), d6()]
        const total = dice[0]! + dice[1]!
        const table = military ? militaryHardwareTable : civilianHardwareTable
        const options = table[total]!.map(hardwareOption)
        return {
            roll: categoryRoll,
            category: military ? 'military-hardware' : 'civilian-hardware',
            dice,
            total,
            choice: options.length > 1,
            options,
            module: options[Math.floor(Math.random() * options.length)],
        }
    }

    // --- weapon --------------------------------------------------------------------------------
    const withSubtype = categoryRoll === 3
    const rolls = {range: d6(), type: d6(), power: d6(), subtype: undefined as number | undefined, secondSubtype: undefined as number | undefined}

    let expendable = false
    const subtypes: WeaponSubtype[] = []

    if (withSubtype) {
        rolls.subtype = d6()
        const sub = scrapWeaponSubtype[rolls.subtype - 1]!
        if (sub === 'X' || sub === 'X+') expendable = true
        else subtypes.push(subtypeMap[sub]!)

        if (sub === 'X+') {
            rolls.secondSubtype = d6()
            const second = scrapWeaponSecondSubtype[rolls.secondSubtype - 1]!
            if (second) subtypes.push(subtypeMap[second]!)
        }
    }

    const profile: WeaponProfile = {
        range: rangeMap[scrapWeaponRange[rolls.range - 1]!]!,
        type: typeMap[scrapWeaponType[rolls.type - 1]!]!,
        power: scrapWeaponPower[rolls.power - 1]!,
        // the model holds a single subtype, a second one is listed separately in `extraSubtypes`
        subtype: subtypes[0],
        expendable,
        name: randomScrapWeaponName(),
    }
    const option: RolledModule = {type: 'Weapon', label: buildWeaponDisplayString(profile), profile}

    return {
        roll: categoryRoll,
        category: withSubtype ? 'weapon-subtype' : 'weapon',
        rolls,
        choice: false,
        extraSubtypes: subtypes.slice(1),
        options: [option],
        module: option,
    }
})
