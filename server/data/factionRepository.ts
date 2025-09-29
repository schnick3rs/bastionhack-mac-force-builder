import type {Faction} from "~~/types/unit";

const factions: Faction[] = [];

const create = (
  name: string,
  origin: string,
  specialRule: string,
  specialModule: string,
  sparks: string
) => {
  return {
      key: name.toLowerCase()                // make lowercase
          .trim()                       // remove leading/trailing spaces
          .replace(/[^a-z0-9\s-]/g, '') // remove special characters
          .replace(/\s+/g, '-')         // replace spaces with -
          .replace(/-+/g, '-'),
      name,
      origin,
      specialRule,
      specialModule,
      sparks: sparks.split(',')
  };
};

factions.push(
    create('Elder Circle', 'Formerly HumanityFleet Mission Command', 'Shock Dispersion', 'Rmapart', 'ruthless,brutalist,mountainous,relentless'),
    create('Grand Forge', 'Formerly HumanityFleet HeavyWare Development', 'Hammer Forged', 'Extinguisher', 'industrial,smoke,loud,reinforced'),
);

export default factions;