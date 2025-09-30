import type {AuxiliaryType, Entry, MAC} from "~~/types/unit";

function sortEntries(entries: Entry[]): Entry[] {
    return [...entries].sort((a, b) => {
        // 1. Sort by classification priority
        const getPriority = (entry: Entry): number => {
            switch (entry.classification) {
                case "MAC": return 0;
                case "Formation": return 1; // keep last (or drop if not needed)
                default: return 99;
            }
        };

        const priorityA = getPriority(a);
        const priorityB = getPriority(b);

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // 2. Within MAC → class descending
        if (a.classification === "MAC" && b.classification === "MAC") {
            let maca = b as MAC;
            let macb = a as MAC;
            return maca.class - macb.class;

            return maca.name.localeCompare(macb.name);
        }

        // 3. Within Auxiliary → Vehicle first, then Infantry, then name
        if (a.classification === "Formation" && b.classification === "Formation") {
            const auxA = a;
            const auxB = b;

            const typeOrder: AuxiliaryType[] = ["Vehicle", "Infantry"];
            const typeA = typeOrder.indexOf(auxA.unit.type);
            const typeB = typeOrder.indexOf(auxB.unit.type);

            if (typeA !== typeB) {
                return typeA - typeB;
            }

            return auxA.unit.name.localeCompare(auxB.unit.name);
        }

        // 4. For Formations or unknowns, fallback to id sorting
        return ("id" in a ? a.id : "").localeCompare("id" in b ? b.id : "");
    });
}

export function sortForceEntries(entries: Entry[]) {
    return sortEntries(entries);
}