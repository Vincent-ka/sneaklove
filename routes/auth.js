const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const userModel = require("./../models/User");


router.get("/signup", (req, res) => {
    res.render("signup")
});

router.get("/signin", (req, res) => {
    res.render("signin")
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/signin"));
});


router.post("/signup", (req, res, next) => {
    const user = req.body
    if (!user.name || !user.lastname || !user.email || !user.password) {
        req.flash("warning", "Veuillez remplir tous les champs requis !")
        res.redirect("/signup")
    }
    userModel
        .findOne({
            email: user.email
        })
        .then((dbRes) => {
            if (dbRes) {
                req.flash("warning", "Désolé cet email est déjà pris");
                res.redirect("/signup")
            }
        })
        .catch(next)

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(user.password, salt);
    user.password = hashed;

    userModel
        .create(user)
        .then((dbRes) => {
            req.flash("success", "Votre inscription est validée !");
            res.redirect("/signin")
        })
        .catch(next)

})

router.post("/signin", (req, res, next) => {
    const userInfos = req.body;

    if (!userInfos.email || !userInfos.password) {
        req.flash("warning", "Attention, l'email et le password sont requis");
        res.redirect("/signin");
    }
    userModel
        .findOne({
            email: userInfos.email
        })
        .then((user) => {
            if (!user) {
                req.flash("error", "Identifiants incorrects");
                res.redirect("/signin");
            }

            const checkPassword = bcrypt.compareSync(
                userInfos.password,
                user.password
            );

            if (checkPassword === false) {
                req.flash("error", "Identifiants incorrects");
                res.redirect("/signin");
            }

            const {
                _doc: clone
            } = {
                ...user
            };
            delete clone.password;

            req.session.currentUser = clone

            res.redirect("/")
        })
        .catch(next);
});


module.exports = router;