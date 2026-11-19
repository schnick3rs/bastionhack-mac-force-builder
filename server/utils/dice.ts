/** Rolls 2d6. A forced total (2-12) is split into two plausible dice. */
export function roll2d6(forced?: unknown, label = 'roll'): { roll: number, dice: [number, number] } {
    if (forced !== undefined && forced !== '') {
        const total = Number(forced)
        if (!Number.isInteger(total) || total < 2 || total > 12) {
            throw createError({statusCode: 400, statusMessage: `${label} must be a whole number between 2 and 12`})
        }
        const first = Math.min(6, total - 1)
        return {roll: total, dice: [first, total - first]}
    }
    const dice: [number, number] = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]
    return {roll: dice[0] + dice[1], dice}
}
