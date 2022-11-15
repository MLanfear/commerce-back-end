const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
    include: [
      {
        model: Product,
        attributes: []
      }
    ]
  })
    .then(response => res.json(response))
    .catch(err => {
      console.log('an error occured');
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
Category.findOne({
  include: [
    {
      model: Product,
      attributes: []
    }
  ],
    where: {
      id:req.params.id
    }
  })
  .then(response => {
    if (!response) {
        res.status(404).json({ message: "404 Product not Found!" });
    } else {
        res.json(response);
      }
  })
  .catch(err => {
    console.log('an error occured');
    console.log(err);
    res.status(500).json(err);
  });
});


router.post('/', async (req, res) => {
  // create a new category
  const categoryExists = await Category.findOne({
    where: {
      category: req.body.category
    }
  });
  if (categoryExists) {
    console.log('Category exists***********');
    res.status(409).json({ message: "Category exists already!"})
    return;
  }
  try {
    const dbCategory = await Category.create (
      req.body
    )
    req.session.save(() => {
      req.session.categoryID = dbCategory.id;
    })
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value

});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
