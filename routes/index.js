const express = require("express");
const router = express.Router();
const sneakerModel = require("./../models/Sneaker")
const tagModel = require("./../models/Tag");

// Afficher la home
router.get("/", (req, res) => {
  res.render("index");
});

// router.get("/sneakers/:cat", (req, res, next) => {
//   sneakerModel
//     .find()
//     .then((dbRes) => {
//       res.render("products", {
//         sneakers: dbRes
//       })
//     })
//     .catch(next);
// });

// Afficher la collection de tous les produits
router.get("/sneakers/collection", (req, res, next) => {
  Promise.all([sneakerModel.find(), tagModel.find()])
    .then((dbRes) => {
      res.render("products", {
        sneakers: dbRes[0],
        tags: dbRes[1]
      })
    })
    .catch(next)
});

// Afficher la collection des produits pour hommes
router.get("/sneakers/men", (req, res, next) => {
  Promise.all([sneakerModel.find( {"category": "men"} ), tagModel.find()])
    .then((dbRes) => {
      res.render("products", {
        sneakers: dbRes[0],
        tags: dbRes[1]
      })
    })
    .catch(next)
});

// Afficher la collection des produits pour femmes
router.get("/sneakers/women", (req, res, next) => {
  Promise.all([sneakerModel.find( {"category": "women"} ), tagModel.find()])
    .then((dbRes) => {
      res.render("products", {
        sneakers: dbRes[0],
        tags: dbRes[1]
      })
    })
    .catch(next)
});

// Afficher la collection des produits pour enfants
router.get("/sneakers/kids", (req, res, next) => {
  Promise.all([sneakerModel.find( {"category": "kids"} ), tagModel.find()])
    .then((dbRes) => {
      res.render("products", {
        sneakers: dbRes[0],
        tags: dbRes[1]
      })
    })
    .catch(next)
});

// Afficher les détails d'un seul produit
router.get("/one-product/:id", (req, res, next) => {
  sneakerModel
    .findById(req.params.id)
    .then((dbRes) => {
      res.render("one_product", {
        sneaker: dbRes
      })
    })
    .catch(next)
});

module.exports = router;