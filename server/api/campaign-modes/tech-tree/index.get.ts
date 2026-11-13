import {describeUnlock, edges, neighbours, startingAccess, techs} from "~~/server/data/techTreeRepository";
import type {Unlock} from "~~/server/data/techTreeRepository";

const withLabel = (u: Unlock) => ({ ...u, label: describeUnlock(u) })

/**
 * The whole tech tree as a graph.
 *
 * GET /api/campaign-modes/tech-tree
 */
export default defineEventHandler(() => {
    return {
        mode: 'tech-tree',
        startingAccess: startingAccess.map(withLabel),
        nodes: techs.map(t => ({
            ...t,
            unlocks: t.unlocks.map(withLabel),
            neighbours: [...neighbours.get(t.key)!],
        })),
        edges,
    }
})
