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
  include: [
    {
      model: Product,
      attributes: [
        'product_name', 'price', 'stock', 'category_id'
      ]
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
  Category.update(req.body, {
    where: {
      id: req.params.id
    },
  })
    .then((category) => {
      return Category.findAll({ where: { category_id: req.params.id } });
    })
    .then((categoryId) => {
      const categoryIds = categoryId.map (({ category_id }) => category_id)
      const newCategoryId = req.body.categoryIds  
        .filter((category_id) => !categoryIds.includes(category_id))
        .map((category_id) => {
          return {
            category_id :req.params.id,
            category_id,
          };
        });
      const categoryIdsToRemove = categoryId
        .filter(({ category_id}) => !req.body.categoryIds.includes(category_id))
        .map(({ id }) => id);
      return Promise.all([
        Category.destroy({ where: { id:categoryIdsToRemove} }),
        Category.bulkCreate(newCategoryId)
      ]);
    })
    .then((updatedCategoryId) => res.json(updatedCategoryId))
    .catch((err) => {
      res.status(400).json(err);
    });
});


router.delete('/category_id', (req, res) => {
  // delete a category by its `id` value
  const categoryIndex = db.get('category');
  categoryIndex.remove({"_id" : req.params.id});
  res.redirect('/categories');
});

module.exports = router;
