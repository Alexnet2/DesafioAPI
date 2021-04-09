/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";
import { Request, Response } from "express";
import { Hero } from "@types";
import NodeCache from "node-cache";
const cache = new NodeCache();


export const searchHeroes = async (req: Request, res: Response) => {
    const q = req.query.q?.toString();
    if (!cache.get("heroes")) {
        const heroes: Array<Hero> = (await axios(`https://akabab.github.io/superhero-api/api/all.json`)).data
        cache.set('heroes', heroes);
    }
    let herosSearch = new Array<Hero>()
    if (req.headers['case-sensitive']) {
        herosSearch = caseSensitive(cache.get('heroes')!, q!)
    } else {
        herosSearch = caseInsensitive(cache.get('heroes')!, q!);
    }
    res.status(200).send(herosSearch);
}
const caseSensitive = (heros: Array<Hero>, q: string) => {
    const names = heros.filter((hero) => {
        return hero.name.includes(q!)
    });
    const biographies = heros.filter((hero) => {
        return hero.biography.fullName.includes(q!)
    })

    const works = heros.filter(hero => {
        return hero.work.occupation.includes(q!);
    })

    const apperance = heros.filter(hero => {
        if (hero.appearance.eyeColor && hero.appearance.eyeColor.includes(q!)) {
            return hero;
        }
        else if (hero.appearance.gender && hero.appearance.gender.includes(q!)) {
            return hero;
        }
        else if (hero.appearance.hairColor && hero.appearance.hairColor.includes(q!)) {
            return hero;
        }
        // else if (hero.appearance.height) {
        //     return hero.appearance.height.filter(h => { if (h.includes(q!)) return; })
        // }
        else if (hero.appearance.race && hero.appearance.race.includes(q!)) {
            return hero;
        }
        // else if (hero.appearance.weight) {
        //     return hero.appearance.weight.filter(w => { if (w.includes(q!)) return; })
        // }
    })

    return names.concat(apperance).concat(biographies).concat(works);
}
const caseInsensitive = (heros: Array<Hero>, q: string) => {
    const names = heros.filter((hero) => {
        return hero.name.toUpperCase().includes(q!.toUpperCase())
    });

    const apperance = heros.filter(hero => {
        if (hero.appearance.eyeColor && hero.appearance.eyeColor.toUpperCase().includes(q!)) {
            return hero;
        }
        else if (hero.appearance.gender && hero.appearance.gender.toUpperCase().includes(q!.toUpperCase())) {
            return hero;
        }
        else if (hero.appearance.hairColor && hero.appearance.hairColor.toUpperCase().includes(q!.toUpperCase())) {
            return hero;
        }
        if (hero.appearance.height) {
            const height = hero.appearance.height.filter(h => { if (h.toUpperCase().includes(q!.toUpperCase())) return h })
            if (height.length) {
                return hero;
            }
        }
        else if (hero.appearance.race && hero.appearance.race.toUpperCase().includes(q!.toUpperCase())) {
            return hero;
        }
        if (hero.appearance.weight) {
            const weight = hero.appearance.weight.filter(w => {if (w.toUpperCase().includes(q!.toUpperCase())) return w;});
            if (weight.length) {
                return hero;
            }
        }
    })

    const biographies = heros.filter((hero) => {
        return hero.biography.fullName.toUpperCase().includes(q!.toUpperCase())
    })

    const works = heros.filter(hero => {
        return hero.work.occupation.toUpperCase().includes(q!.toUpperCase());
    })

    return names.concat(apperance).concat(biographies).concat(works);
}


export const HeroDetails = async (req: Request, res: Response) => {
    if (!cache.get('heroes')) {
        const heroes: Array<Hero> = (await axios(`https://akabab.github.io/superhero-api/api/all.json`)).data
        cache.set('heroes', heroes);
    }
    const heroes: Array<Hero> = cache.get('heroes')!;

    const herosResult = heroes.filter(hero => { return hero.slug === req.params.slug })

    if (!herosResult.length) {
        res.status(404).send('');
    } else {
        res.status(200).send(herosResult);
    }
}