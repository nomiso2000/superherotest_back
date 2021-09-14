const superheroModel = require('./superhero.model');
const path = require('path');
const Joi = require('joi');
class SuperheroController {
  async createHero(req, res, next) {
    try {
      const newSuperhero = await superheroModel.create(req.body);
      console.log(newSuperhero);
      return res.status(201).json(newSuperhero);
    } catch (err) {
      next(err);
    }
  }

  async updateSuperhero(req, res, next) {
    try {
      const id = req.params.id;
      if (req.body.images) {
        const hero = await superheroModel.findById(id);
        req.body.images.push(...hero.images);
      }
      if (req.body.imgName) {
        const hero = await superheroModel.findById(id);
        req.body.images = hero.images.filter((el) => el !== req.body.imgName);
      }
      const updatedHero = await superheroModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      return res.status(201).json(updatedHero);
    } catch (err) {
      next(err);
    }
  }

  async deleteHero(req, res, next) {
    try {
      const id = req.params.id;
      const deletedHero = await superheroModel.findByIdAndDelete(id);
      if (deletedHero) {
        return res.status(200).json('The hero is deleted');
      } else {
        return res.status(200).json('Id is doesnt find');
      }
    } catch (err) {
      next(err);
    }
  }

  async listHeroes(req, res, next) {
    try {
      const heroes = await superheroModel.find().sort({ createdAt: -1 });
      const page = parseInt(req.query.page, 10);
      const final = page * 5;
      let updatedHeroes;
      if (final > heroes.length) {
        updatedHeroes = heroes.slice(final - 5, heroes.length);
      } else {
        updatedHeroes = heroes.slice(final - 5, final);
      }
      return res.status(200).json({
        heroes: updatedHeroes,
        total: heroes.length,
      });
    } catch (err) {
      next(err);
    }
  }
  async uploadFile(req, res, next) {
    try {
      res.json('File uploaded succes');
      next();
    } catch (err) {
      console.log(err);
    }
  }
  async getImage(req, res) {
    res.sendFile(
      path.join(__dirname, '../..', `public/images/${req.params.name}`)
    );
  }

  async getHero(req, res) {
    const id = req.params.id;
    const hero = await superheroModel.findById(id);
    res.json(hero);
  }

  validateCreateHero(req, res, next) {
    const createRules = Joi.object({
      nickname: Joi.string().required(),
      real_name: Joi.string().required(),
      origin_description: Joi.string().required(),
      superpowers: Joi.string().required(),
      catch_phrase: Joi.string().required(),
      images: Joi.string().required(),
    });

    const validationResult = createRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }
    next();
  }
}

module.exports = new SuperheroController();
