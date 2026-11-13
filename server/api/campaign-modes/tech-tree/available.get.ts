import {describeUnlock, neighbours, startingAccess, summarizeAccess, techs} from "~~/server/data/techTreeRepository";
import type {Unlock} from "~~/server/data/techTreeRepository";

const withLabel = (u: Unlock) => ({ ...u, label: describeUnlock(u) })

/**
 * Which techs a force may choose next and what it has access to so far.
 *
 * GET /api/campaign-modes/tech-tree/available?unlocked=thermal-osmosis,hypertracking
 *
 * Basic techs can always be chosen, an advanced tech only if it is connected to a tech the force already unlocked.
 * `unlocks` lists everything the force gained (starting access plus the unlocked techs), `access` merges it
 * (highest MAC class and weapon power, allowed ranges, types, subtypes, units and hardware).
 */
export default defineEventHandler((event) => {
    const query = getQuery(event)
    const raw = Array.isArray(query.unlocked) ? query.unlocked.join(',') : (query.unlocked ?? '')
    const unlocked = String(raw).split(',').map(s => s.trim()).filter(Boolean)

    const known = new Set(techs.map(t => t.key))
    const unknown = unlocked.filter(key => !known.has(key))
    if (unknown.length) {
        throw createError({ statusCode: 400, statusMessage: `Unknown tech: ${unknown.join(', ')}` })
    }

    const unlockedSet = new Set(unlocked)
    const unlockedTechs = techs.filter(t => unlockedSet.has(t.key))
    const available = techs.filter(t => {
        if (unlockedSet.has(t.key)) return false
        if (t.tier === 'basic') return true
        return [...neighbours.get(t.key)!].some(n => unlockedSet.has(n))
    })

    const unlocks: Unlock[] = [...startingAccess, ...unlockedTechs.flatMap(t => t.unlocks)]

    return {
        unlocked: unlockedTechs.map(t => t.key),
        unlocks: unlocks.map(withLabel),
        access: summarizeAccess(unlocks),
        available: available.map(t => ({ key: t.key, name: t.name, tier: t.tier, unlocks: t.unlocks.map(withLabel) })),
    }
})
