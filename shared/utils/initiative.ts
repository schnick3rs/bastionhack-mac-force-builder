import type {Force} from "~~/types/unit";

/**
 * Initiative deck: one card per unit (MAC, formation) or remote asset, all with the same identical back.
 * Cards are A7 portrait. Front and back sit side by side (front | back) to be cut out and folded in the middle,
 * so an A4 landscape sheet holds 4 cards (2 per row, 2 rows).
 */

export const INITIATIVE_CARDS_PER_SHEET = 4 // with back, 8 without

export interface InitiativeCard {
    id: string
    /** e.g. "Class 2 MAC", "Infantry Formation", "Remote asset" */
    header: string
    name: string
    icon: string
    /** force name */
    footer: string
    /** rules text, remote assets only */
    rule?: string
}

export function buildInitiativeCards(force: Force): InitiativeCard[] {
    const footer = force.name
    return force.entries.map((entry): InitiativeCard => {
        switch (entry.classification) {
            case 'MAC':
                return {id: entry.id, header: `Class ${entry.class} MAC`, name: entry.name, icon: 'i-game-icons-missile-mech', footer}
            case 'Formation':
                return {
                    id: entry.id,
                    header: `${entry.unit.type} Formation`,
                    name: `${entry.size}× ${entry.unit.name}`,
                    icon: entry.unit.type === 'Vehicle' ? 'i-game-icons-tank' : 'i-game-icons-dark-squad',
                    footer,
                }
            case 'Remote asset':
                return {id: entry.id, header: 'Remote asset', name: entry.name, icon: 'i-game-icons-radar-dish', footer, rule: entry.effect}
        }
    })
}

/** cards in chunks per sheet, null pads the last sheet */
export function chunkSheets<T>(cards: T[], perSheet = INITIATIVE_CARDS_PER_SHEET): (T | null)[][] {
    const sheets: (T | null)[][] = []
    for (let i = 0; i < cards.length; i += perSheet) {
        const sheet: (T | null)[] = cards.slice(i, i + perSheet)
        while (sheet.length < perSheet) sheet.push(null)
        sheets.push(sheet)
    }
    return sheets
}
