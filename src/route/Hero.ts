/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Express } from 'express'
import { searchHeroes, HeroDetails } from 'middlewares/HeroMiddleware'
import { Hero } from '@types'

const Hero = (app: Express) => {
    app.post('/search', (req, res, next) => {
        if (Object.keys(req.query).length == 1) {
            if (req.query.q && req.query.q.length! >= 3) {
                next()
            } else {
                res.status(400).send({
                    message: "Tamanho de 3 caracteres ou mais é requirido"
                })
            }
        } else {
            res.status(405).send({
                message: "É necessário um atributo para realizar a consulta."
            })
        }
    }, searchHeroes)
    app.get('/hero/:slug', HeroDetails)
}
export default Hero;