const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
const sneakerModel = require("./../models/Sneaker");
const tagModel = require("./../models/Tag");
const uploader = require("./../config/cloudinary");


router.get("/prod-add", (req, res, next) => {
    tagModel
        .find()
        .then((dbRes) => {
            res.render("products_add", {
                tags: dbRes
            })
        })
        .catch(next)
})

router.get("/prod-manage", (req, res, next) => {
    sneakerModel
        .find()
        .then((dbRes) => {
            res.render("products_manage", {
                sneakers: dbRes,
            })
        })
        .catch(next);
})

router.get("/product-edit/:id", (req, res, next) => {
    sneakerModel
        .findById(req.params.id)
        .then((dbRes) => {
            res.render("product_edit", {
                sneaker: dbRes
            })
        })
        .catch(next)
});

router.post("/prod-edit/:id", (req, res, next) => {
    sneakerModel
        .findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.redirect("/prod-manage"))
        .catch(next);
})

router.post("/product-delete/:id", (req, res, next) => {
    sneakerModel
        .findByIdAndDelete(req.params.id)
        .then((dbRes) => {
            res.redirect("/prod-manage")
        })
        .catch(next)
})

router.post("/prod-add", uploader.single("image"), (req, res, next) => {
    const newsneaker = {... req.body};
    if (req.file) newsneaker.image = req.file.secure_url;
    sneakerModel
        .create(newsneaker)
        .then((dbRes) => {
            res.redirect("/sneakers/collection")
        })
        .catch(next)
})


// ------------ tag ---------------
router.post("/tag-add", (req, res, next) => {
    tagModel
        .create(req.body)
        .then((dbRes) => {
            res.redirect("/prod-add")
        })
        .catch(next)
})



module.exports = router;