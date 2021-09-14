const express = require('express');
const superheroController = require('./superhero.controller');
const superheroRouter = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

superheroRouter.get('/', superheroController.listHeroes);
superheroRouter.get('/image/:name', superheroController.getImage);
superheroRouter.get('/hero/:id', superheroController.getHero);
superheroRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views/index.html'));
});

superheroRouter.post(
  '/',
  superheroController.validateCreateHero,
  superheroController.createHero
);
superheroRouter.post(
  '/upload',
  upload.single('file'),
  superheroController.uploadFile
);

superheroRouter.patch('/:id', superheroController.updateSuperhero);

superheroRouter.delete('/:id', superheroController.deleteHero);

module.exports = superheroRouter;
