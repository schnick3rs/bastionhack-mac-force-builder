// Scenario generator tables (MAC Attack, p20-21)

export type Division = 'A' | 'B' | 'C'
export type Side = 'red' | 'blue'

/** Points on the board: 1,3,7,9 corners; 2,4,6,8 edge centres; 5 board centre. */
export interface DeploymentStep {
    round: number
    /** division -> point it enters the board at */
    divisions: { division: Division, point: number }[]
}

export interface Marker {
    points?: number[]
    /** a line drawn between two points */
    line?: [number, number]
}

export interface ScenarioObjective {
    roll: number
    text: string
    marker?: Marker
}

export interface ScenarioTwist {
    roll: number
    name: string
    text: string
}

/** parses the printed shorthand, e.g. "R1 (A1 B2), R2 (C4)" */
function parseDeployment(text: string): DeploymentStep[] {
    return [...text.matchAll(/R(\d+) \(([^)]*)\)/g)].map(m => ({
        round: Number(m[1]),
        divisions: m[2]!.trim().split(/\s+/).map(d => ({division: d[0] as Division, point: Number(d.slice(1))})),
    }))
}

const redDeploymentText: Record<number, string> = {
    2: 'R1 (A1 B2), R2 (C4)',
    3: 'R1 (A2 C3), R2 (B4)',
    4: 'R1 (A2), R2 (B1 C4)',
    5: 'R1 (A1 B4), R2 (C3)',
    6: 'R1 (A1), R2 (B2 C4)',
    7: 'R1 (A2), R2 (B1 C3)',
    8: 'R1 (A1), R2 (B4 C2)',
    9: 'R1 (A1 C4), R2 (B3)',
    10: 'R1 (A2), R2 (B4 C1)',
    11: 'R1 (A2 B3), R2 (C4)',
    12: 'R1 (A1 C2), R2 (B4)',
}

const blueDeploymentText: Record<number, string> = {
    2: 'R1 (A8 B7), R2 (C8)',
    3: 'R1 (A5 B8), R2 (C6)',
    4: 'R1 (A7), R2 (B6 C8)',
    5: 'R1 (A9 B7), R2 (C6)',
    6: 'R1 (A5), R2 (B6 C8)',
    7: 'R1 (A8), R2 (B7 C9)',
    8: 'R1 (A5), R2 (B8 C6)',
    9: 'R1 (A9 C7), R2 (B6)',
    10: 'R1 (A7), R2 (B9 C6)',
    11: 'R1 (A5 C8), R2 (B6)',
    12: 'R1 (A8 C7), R2 (B8)',
}

export const deploymentTables: Record<Side, Record<number, DeploymentStep[]>> = {
    red: Object.fromEntries(Object.entries(redDeploymentText).map(([k, v]) => [k, parseDeployment(v)])),
    blue: Object.fromEntries(Object.entries(blueDeploymentText).map(([k, v]) => [k, parseDeployment(v)])),
}

export const redObjectives: ScenarioObjective[] = [
    {roll: 2, text: 'Destroy all of Div B.'},
    {roll: 3, text: 'Breach 9 class 1 buildings, placed by blue.'},
    {roll: 4, text: 'Destroy a MAC from each Div.'},
    {roll: 5, text: 'Have MACs at points 7 and 8.', marker: {points: [7, 8]}},
    {roll: 6, text: 'Destroy the enemy commander.'},
    {roll: 7, text: 'Breach 3 class 3 buildings, placed by blue.'},
    {roll: 8, text: 'Have a Div A MAC at point 8.', marker: {points: [8]}},
    {roll: 9, text: 'Have a unit within 3" of point 5 and no enemies there.', marker: {points: [5]}},
    {roll: 10, text: 'Destroy 2 blue units: 1 chosen by blue, 1 red.'},
    {roll: 11, text: 'Breach 6 class 2 buildings, placed by blue.'},
    {roll: 12, text: 'Destroy all of Div C.'},
]

export const blueObjectives: ScenarioObjective[] = [
    {roll: 2, text: 'Destroy at least half of the enemy points cost.'},
    {roll: 3, text: 'Reduce all Divs to half their starting number of units.'},
    {roll: 4, text: 'Draw a line from point 2 to 8. Have no enemy to the right of the line.', marker: {line: [2, 8]}},
    {roll: 5, text: 'Have a Div A MAC at point 1.', marker: {points: [1]}},
    {roll: 6, text: 'Destroy all of Div C.'},
    {roll: 7, text: 'Destroy all of Div A.'},
    {roll: 8, text: 'Destroy all of Div B.'},
    {roll: 9, text: 'Destroy at least 3 modules on every enemy MAC.'},
    {roll: 10, text: 'Draw a line from point 4 to 6. Have no enemy below the line.', marker: {line: [4, 6]}},
    {roll: 11, text: 'Have 1 MAC from each Div within 3" of point 5.', marker: {points: [5]}},
    {roll: 12, text: 'Cause at least 1 internal damage to every enemy MAC.'},
]

export const twists: ScenarioTwist[] = [
    {roll: 2, name: 'Surprise', text: 'Divs A must hold on round 1.'},
    {roll: 3, name: 'Wild', text: 'Take a hit to move through rough/cover.'},
    {roll: 4, name: 'Dark', text: '+1TN to round 1 attacks.'},
    {roll: 5, name: 'Fog', text: 'No line of sight beyond 12" on round 1.'},
    {roll: 6, name: 'Fatigue', text: 'Divs A begin the game with 3 Heat.'},
    {roll: 7, name: 'Soft', text: 'No rushing on round 1.'},
    {roll: 8, name: 'Cold', text: 'Units cool an extra Heat in cooldown.'},
    {roll: 9, name: 'Shadows', text: 'Units cannot shoot in or out of cover.'},
    {roll: 10, name: 'Mark', text: 'Attacks vs Divs A get -1TN on round 1.'},
    {roll: 11, name: 'Nova', text: 'Pre-meltdown, MACs on 6 Heat take a hit.'},
    {roll: 12, name: 'Shock', text: 'Divs A cannot attack on round 1.'},
]
