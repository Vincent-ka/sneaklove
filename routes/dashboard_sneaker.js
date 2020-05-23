const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
const sneakerModel = require("./../models/Sneaker");
const tagModel = require("./../models/Tag");
const uploader = require("./../config/cloudinary");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute")

// Afficher la page pour ajouter un produit
router.get("/prod-add", protectPrivateRoute, (req, res, next) => {
    tagModel
        .find()
        .then((dbRes) => {
            res.render("products_add", {
                tags: dbRes
            })
        })
        .catch(next)
})

// Afficher la page pour manager les produits
router.get("/prod-manage", protectPrivateRoute, (req, res, next) => {
    sneakerModel
        .find()
        .then((dbRes) => {
            res.render("products_manage", {
                sneakers: dbRes,
            })
        })
        .catch(next);
})

// Afficher la page pour éditer un produit
router.get("/product-edit/:id", protectPrivateRoute, (req, res, next) => {
    sneakerModel
        .findById(req.params.id)
        .then((dbRes) => {
            res.render("product_edit", {
                sneaker: dbRes
            })
        })
        .catch(next)
});

// Editer un produit
router.post("/prod-edit/:id", protectPrivateRoute, (req, res, next) => {
    sneakerModel
        .findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.redirect("/prod-manage"))
        .catch(next);
})

// Effacer un produit
router.post("/product-delete/:id", protectPrivateRoute, (req, res, next) => {
    sneakerModel
        .findByIdAndDelete(req.params.id)
        .then((dbRes) => {
            res.redirect("/prod-manage")
        })
        .catch(next)
})

// Ajouter un produit
router.post("/prod-add", protectPrivateRoute, uploader.single("image"), (req, res, next) => {
    const newsneaker = {
        ...req.body
    };
    if (req.file) newsneaker.image = req.file.secure_url;
    sneakerModel
        .create(newsneaker)
        .then((dbRes) => {
            res.redirect("/sneakers/collection")
        })
        .catch(next)
})

// Ajouter un tag
router.post("/tag-add", protectPrivateRoute, (req, res, next) => {
    tagModel
        .create(req.body)
        .then((dbRes) => {
            res.redirect("/prod-add")
        })
        .catch(next)
})

module.exports = router;