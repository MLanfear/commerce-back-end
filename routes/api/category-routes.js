const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
    include: [Product]
  })
    .then(categories => res.json(categories))
    .catch(err => 
    res.status(500).json(err));
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
Category.findOne({
    where: {
      id:req.params.id
    },
    include: [Product]
  })
  .then(category => {
    if (!category) {
        res.status(404).json({ message: "Category ID does not exist!" });
    return;
    }
    res.json(category);
  })
  .catch(err => 
  res.status(500).json(err));
});


router.post('/', async (req, res) => {
  // create a new category
  Category.create(req.body)
  .then(newCategory => res.json(newCategory))
  .catch(err => res.status(400).json(err))
});

router.put('/category_id', async (req, res,) => { 
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then((updatedCategory) => {
    if(!updatedCategory) {
      res.status(404).json({ message: "Category ID does not exist!" });
    }
    res.json(updatedCategory);
  })
  .catch(err => res.status(500).json(err));
});


router.delete('/category_id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(category => {
    if(!category) {
      res.status(404).json({ message: "Category ID does not exist!" })
    }
    res.json(category);
  })
  .catch(err => res.status(500).json(err));
});
module.exports = router;
