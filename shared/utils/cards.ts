import type {Entry, Faction, Force, Formation, MAC, ModuleConfig} from "~~/types/unit";
import factions from "~~/server/data/factionRepository";
import {convertToNiceware, getHardwareCatalogue} from "#shared/utils/modules";
import {buildWeaponDisplayString} from "#shared/utils/weapons";
import {calculateFormationCost, calculateMacCost} from "#shared/utils/units";

/**
 * Builds printable "cards" (A7 / A8 landscape) for a force and arranges them on A4 landscape sheets
 * (4 x 2 grid of A7 slots, two A8L cards share one slot).
 */

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'

export const suitSymbol: Record<Suit, string> = {spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣'}
const suitSwap: Record<Suit, Suit> = {spades: 'clubs', hearts: 'diamonds', diamonds: 'hearts', clubs: 'spades'}
const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']

export interface Activation {
    rank: string
    suit: Suit
}

export interface FactionBox {
    name: string
    text: string
}

export interface MacRow {
    slots: number[]       // more than one slot = identical adjacent hardware, merged
    name: string
    rule?: string
    fullRule?: string     // untruncated rule (e.g. the Carrier text), used by the game view
    weapon: boolean
    used: boolean
    full: boolean         // render rule over the full card width
    empty: boolean
}

export interface MacCard {
    kind: 'mac'
    id: string
    activation: Activation
    division?: number
    name: string
    cls: number
    pts: number
    internalBoxes: number
    zeroRow?: MacRow
    zeroRule?: FactionBox
    rows: MacRow[]
    faction?: FactionBox
}

export interface FormationWeapon {
    name: string
    used: boolean
}

export interface FormationHardware {
    name: string
    rule: string
}

export interface FormationCard {
    kind: 'formation'
    id: string
    activation: Activation
    division?: number
    title: string
    sub: string
    solid: number
    max: number
    helper: string
    weapons: FormationWeapon[]
    hardware: FormationHardware[]
    auSlots: number
    big: boolean
    faction?: FactionBox
}

export interface ModuleCard {
    kind: 'module'
    id: string
    name: string
    sub: string
    rule: string
    slots: number
}

export interface AssetCard {
    kind: 'asset'
    id: string
    activation: Activation
    title: string
    sub: string
    effect: string
}

export type Card = MacCard | FormationCard | ModuleCard | AssetCard

export type SheetSlot =
    | { type: 'a7', card: MacCard | FormationCard }
    | { type: 'a8', cards: [Card, Card | undefined] }
    | { type: 'empty' }

const SLOTS_PER_SHEET = 8

const CARRIER_RULE = 'Keep up to 2 infantry AUs off the board, noted as being inside this carrier. ' +
    'On their move activation they may deploy from their carrier unit. ' +
    'If the carrier is destroyed, all AUs inside are also destroyed. Deployed units cannot re-enter.'

export function activationFor(index: number, suit: Suit): Activation {
    if (index < RANKS.length) return {rank: RANKS[index]!, suit}
    return {rank: RANKS[(index - RANKS.length) % RANKS.length]!, suit: suitSwap[suit]}
}

function plural(n: number, word: string) {
    return `${n} ${word}${n === 1 ? '' : 's'}`
}

function factionBox(faction: Faction | undefined, cls: number): FactionBox | undefined {
    if (!faction) return undefined
    const raw = faction.specialRule.cardText ?? faction.specialRule.description
    const text = raw
        .replace('{class} hits', plural(cls, 'hit'))
        .replace('{class}', String(cls))
    return {name: faction.specialRule.name, text}
}

// ---------------------------------------------------------------------------------------------
// MAC
// ---------------------------------------------------------------------------------------------

function macRule(name: string, rules: Map<string, string>): string | undefined {
    const rule = rules.get(name)
    if (rule === undefined) return undefined
    if (name === 'Cloak') return rule.replace(' AUs can do this.', '')
    if (name === 'Carrier') return 'See Carrier card.'
    return rule
}

function moduleToRow(m: ModuleConfig, rules: Map<string, string>): MacRow {
    if (m.type === 'Weapon') {
        return {
            slots: [m.slot], name: buildWeaponDisplayString(m.profile), weapon: true,
            used: !!m.profile.expendable, full: false, empty: false,
        }
    }
    if (m.type === 'Hardware') {
        const rule = macRule(m.profile.name, rules)
        return {slots: [m.slot], name: m.profile.name, rule, fullRule: rules.get(m.profile.name), weapon: false, used: false, full: false, empty: false}
    }
    return {slots: [m.slot], name: 'Empty', weapon: false, used: false, full: false, empty: true}
}

function buildMacRows(modules: ModuleConfig[], rules: Map<string, string>): MacRow[] {
    const rows: MacRow[] = []
    for (const m of [...modules].sort((a, b) => a.slot - b.slot)) {
        const row = moduleToRow(m, rules)
        const last = rows[rows.length - 1]
        // identical adjacent hardware modules are merged, weapons never
        if (last && !row.weapon && !row.empty && !last.weapon && !last.empty && last.name === row.name) {
            last.slots.push(...row.slots)
        } else {
            rows.push(row)
        }
    }
    for (const row of rows) {
        row.full = row.slots.length === 1 && (row.rule?.length ?? 0) > 150
    }
    return rows
}

function buildMacCard(mac: MAC, activation: Activation, faction: Faction | undefined, rules: Map<string, string>): MacCard {
    const zero = mac.modules.filter(m => m.slot === 0)
    const regular = mac.modules.filter(m => m.slot !== 0)
    const zeroRule = faction?.specialRule.zeroSlot ? factionBox(faction, mac.class) : undefined

    return {
        kind: 'mac',
        id: mac.id,
        activation,
        division: mac.division,
        name: mac.name,
        cls: mac.class,
        pts: calculateMacCost(mac),
        internalBoxes: mac.class + (faction?.specialRule.internalBonus ?? 0),
        zeroRow: zero.length ? buildMacRows(zero, rules)[0] : undefined,
        zeroRule: zero.length ? zeroRule : undefined,
        rows: buildMacRows(regular, rules),
        faction: zeroRule ? undefined : factionBox(faction, mac.class),
    }
}

// ---------------------------------------------------------------------------------------------
// Formation
// ---------------------------------------------------------------------------------------------

function formationRule(name: string, count: number, rules: Map<string, string>): { label: string, rule: string } {
    let rule = rules.get(name) ?? ''
    if (name === 'Armour') {
        rule = count > 1 ? 'Roll 3+ to ignore each hit.' : 'Roll 5+ to ignore each hit.'
    }
    if (name === 'Aerodrive') rule = rule.replace(' Your Motion is 3.', '')
    if (name === 'Carrier') rule = CARRIER_RULE
    return {label: count > 1 ? `${name} (x${count})` : name, rule}
}

function buildFormationCard(f: Formation, activation: Activation, faction: Faction | undefined, rules: Map<string, string>): FormationCard {
    const unit = f.unit
    const infantry = unit.type === 'Infantry'
    const nice = convertToNiceware(unit.hardware)
        .sort((a, b) => (a.name === 'Carrier' ? 1 : 0) - (b.name === 'Carrier' ? 1 : 0) || a.name.localeCompare(b.name))

    const hardware: FormationHardware[] = nice.map(h => {
        const {label, rule} = formationRule(h.name, h.count, rules)
        return {name: label, rule}
    })

    const aerodrive = nice.some(h => h.name === 'Aerodrive')
    const helper = infantry
        ? "Motion 2 • Can't Rush • Brawl +1AD • Enters Buildings"
        : aerodrive ? 'Motion 3 (Aerodrive)' : 'Motion 2'

    const carriers = nice.find(h => h.name === 'Carrier')?.count ?? 0

    const ruleLength = hardware.reduce((sum, h) => sum + h.rule.replace('Your Motion is 3.', '').length, 0)
    const allUnits = !!faction?.specialRule.appliesToAuxiliary

    return {
        kind: 'formation',
        id: f.id,
        activation,
        division: f.division,
        title: `${f.size}× ${unit.name}`,
        sub: `Class 0 ${unit.type} Formation · ${calculateFormationCost(f)} pts`,
        solid: f.size,
        max: infantry ? 5 : 3,
        helper,
        weapons: unit.weapons.map(w => ({name: buildWeaponDisplayString(w), used: !!w.expendable})),
        hardware,
        auSlots: carriers * 2,
        big: ruleLength > 200 || allUnits,
        faction: allUnits ? factionBox(faction, 0) : undefined,
    }
}

// ---------------------------------------------------------------------------------------------
// Sheets
// ---------------------------------------------------------------------------------------------

export function buildCards(force: Force, suit: Suit) {
    const faction = factions.find(f => f.key === force.faction)
    const rules = new Map(getHardwareCatalogue(force.faction).map(h => [h.name, h.effect]))

    const macs: MacCard[] = []
    const formations: FormationCard[] = []
    const moduleCards: ModuleCard[] = []
    const assets: AssetCard[] = []

    force.entries.forEach((entry: Entry, index: number) => {
        const activation = activationFor(index, suit)
        if (entry.classification === 'MAC') {
            macs.push(buildMacCard(entry, activation, faction, rules))
            // long rules (Carrier) are printed on a separate module card
            const carriers = entry.modules.filter(m => m.type === 'Hardware' && m.profile.name === 'Carrier').length
            if (carriers) {
                moduleCards.push({
                    kind: 'module', id: `${entry.id}-carrier`, name: 'Carrier',
                    sub: `Module · ${entry.name}`, rule: CARRIER_RULE, slots: carriers * 2,
                })
            }
        } else if (entry.classification === 'Formation') {
            formations.push(buildFormationCard(entry, activation, faction, rules))
        } else if (entry.classification === 'Remote asset') {
            assets.push({
                kind: 'asset',
                id: entry.id,
                activation,
                title: entry.name,
                sub: `Remote Asset${entry.cost ? ` · ${entry.cost} pts` : ''}`,
                effect: entry.effect ?? '',
            })
        }
    })

    return {macs, formations, moduleCards, assets, faction}
}

export function buildSheets(force: Force, suit: Suit): SheetSlot[][] {
    const {macs, formations, moduleCards, assets} = buildCards(force, suit)

    const slots: SheetSlot[] = [
        ...macs.map((card): SheetSlot => ({type: 'a7', card})),
        ...formations.filter(f => f.big).map((card): SheetSlot => ({type: 'a7', card})),
    ]

    const small: Card[] = [...moduleCards, ...formations.filter(f => !f.big), ...assets]
    for (let i = 0; i < small.length; i += 2) {
        slots.push({type: 'a8', cards: [small[i]!, small[i + 1]]})
    }

    const sheets: SheetSlot[][] = []
    for (let i = 0; i < slots.length; i += SLOTS_PER_SHEET) {
        sheets.push(slots.slice(i, i + SLOTS_PER_SHEET))
    }
    if (!sheets.length) sheets.push([])
    for (const sheet of sheets) {
        while (sheet.length < SLOTS_PER_SHEET) sheet.push({type: 'empty'})
    }
    return sheets
}

