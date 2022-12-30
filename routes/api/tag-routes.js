const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
router.get('/', (req, res) => {
  Tag.findAll({
    include: [{
      model: Product,
      through: ProductTag
    }]
  })
  .then(tags => res.json(tags))
  .catch(err => res.status(500).json(err));
});

// find a single tag by its `id`
router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: Product,
      through: ProductTag
    }]
  })
  .then(tag => {
    if(!tag) {
      res.status(404).json({ message: "Tag ID does not exist!" });
      return
    }
    res.json(tag);
  })
  .catch(err => res.status(500).json(err));
});

// create a new tag
router.post('/', (req, res) => {
  Tag.create(req.body)
  .then(newTag => res.json(newTag))
  .catch(err => res.status(400).json(err));
});

// update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(updatedTag => {
    if(!updatedTag) {
      res.status(404).json({ message: "Tag ID does not exist!" });
      return
    }
    res.json(updatedTag);
  })
  .catch(err => res.status(500).json(err));
});

// delete on tag by its `id` value
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(tag => {
    if(!tag) {
      res.status(404).json({ message: "Tag ID does not exist!" })
    }
    res.json(tag);
  })
  .catch(err => res.status(500).json(err));
});
module.exports = router;
