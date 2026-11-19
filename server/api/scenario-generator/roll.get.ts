import {blueObjectives, deploymentTables, redObjectives, twists} from "~~/server/data/scenarioRepository";

/**
 * Rolls a complete scenario (p20-21): deployment and objective for both forces plus the public twist.
 *
 * GET /api/scenario-generator/roll
 * GET /api/scenario-generator/roll?redDeployment=2&blueDeployment=7&redObjective=5&blueObjective=11&twist=3
 *   every roll (2-12) can be fixed, the others are still random
 */
export default defineEventHandler((event) => {
    const q = getQuery(event)

    const redDeployment = roll2d6(q.redDeployment, 'redDeployment')
    const blueDeployment = roll2d6(q.blueDeployment, 'blueDeployment')
    const redObjective = roll2d6(q.redObjective, 'redObjective')
    const blueObjective = roll2d6(q.blueObjective, 'blueObjective')
    const twist = roll2d6(q.twist, 'twist')

    return {
        red: {
            deployment: {...redDeployment, steps: deploymentTables.red[redDeployment.roll]},
            objective: {...redObjective, ...redObjectives.find(o => o.roll === redObjective.roll)!},
        },
        blue: {
            deployment: {...blueDeployment, steps: deploymentTables.blue[blueDeployment.roll]},
            objective: {...blueObjective, ...blueObjectives.find(o => o.roll === blueObjective.roll)!},
        },
        twist: {...twist, ...twists.find(t => t.roll === twist.roll)!},
    }
})
