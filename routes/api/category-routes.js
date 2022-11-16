const router = require('express').Router();
const { Category, Product } = require('../../models');
const seedCategories = require('../../seeds/category-seeds');

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
      res.json('New category created!')

    })
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/category_id', async (req, res,) => { 
  // update a category by its `id` value
  const categoryId = await Category.findOne({
    title: req.body.title,
    category: req.body.category,
    description: req.body.desc
  });
  try {
  categoryId.update({_id: id}, {
    $set: categoryId
  });
  res.redirect('/category');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/category_id', (req, res) => {
  // delete a category by its `id` value
  const categoryIndex = db.get('category');
  categoryIndex.remove({"_id" : req.params.id});
  res.redirect('/category');
});

module.exports = router;
