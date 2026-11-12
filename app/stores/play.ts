import {defineStore} from "pinia";

/**
 * Marks made while playing (damage, losses, used weapons). Kept apart from the force itself,
 * keyed by `${forceId}|${entryId}|${kind}|${id}`, each value being a small counter.
 */
export const usePlayStore = defineStore('playStore', {
    state: () => ({
        marks: {} as Record<string, number>,
    }),

    persist: {
        key: 'play',
        storage: piniaPluginPersistedstate.localStorage(),
    },

    getters: {
        get: (state) => (key: string): number => state.marks[key] ?? 0,
    },

    actions: {
        /** Click on box `index` of a row of boxes: fills up to it, clicking the last filled one empties it again. */
        toggleBox(key: string, index: number) {
            const current = this.marks[key] ?? 0
            this.marks[key] = current === index + 1 ? index : index + 1
        },

        reset(forceId: string) {
            for (const key of Object.keys(this.marks)) {
                if (key.startsWith(`${forceId}|`)) delete this.marks[key]
            }
        },
    },
})
