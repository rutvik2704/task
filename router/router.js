const router = require("express").Router();
const User = require("../model/user");
const PostUser = require("../model/postdata");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const passport = require("passport");
require('../middleware/passport')(passport);

/********************* user registration api router. Task-1/2 *********************/
// http://localhost:9000/reg      

router.post("/reg", async (req, res) => {
    try {
        const RegData = new User(req.body)
        console.log(RegData);
        const saveData = await RegData.save()
        res.send(saveData)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

/********************* find registred user api router. *********************/
//  http://localhost:9000/getuser    
router.get("/getuser", async (req, res) => {
    try {
        const userData = await User.find()
        res.send(userData)
    } catch (error) {
        res.send(error)
    }
})

/********************* user login and generate JWt token api router. *********************/
// http://localhost:9000/login
router.post("/login", async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.body.email })
        const isValid = await bcrypt.compare(req.body.pass, userData.pass)

        if (isValid) {
            const token = await userData.generateToken();
            res.send("Token  : " + token)
        }
        else {
            res.send("Invalid credentials !!!!")
        }
    } catch (error) {
        console.log(error);
        res.send("Invalid credentials : " + error);
    }
})

/********************* only Authenticated user can post router. *********************/
// http://localhost:9000/postData
router.post("/postData",auth, async (req, res) => {

    try {
        const user = req.user
        const postData = new PostUser({
            title: req.body.title,
            body: req.body.body,
            createdby: user._id,
            isActive: req.body.isActive,
            lat: req.body.lat,
            long: req.body.long
        })
        console.log(postData);
        const data = await postData.save()
        res.send(data)
    } catch (error) {
        console.log(error);

        res.send("invalid credentials :" + error)
    }
})

/********************* fetch data by latitude longitude api router. *********************/
//  http://localhost:9000/LatLong

router.post("/LatLong", async (req, res) => {

    try {
        const postdata = await PostUser.find({ lat: req.body.lat, long: req.body.long })
        console.log("ok");
        res.send(postdata)
    } catch (error) {
        res.send(error)
    }
})

/********************* fetch status how many post active and inActive api router. *********************/
//  http://localhost:9000/PostCount
router.get("/PostCount", async (req, res) => {
    try {
        const getdata = await PostUser.find()
        var count = 0;
        for (let i = 0; i < getdata.length; i++) {
            if (getdata[i].isActive == true) {
                count++;
            }
        }
        var lengthOfgetData = getdata.length
        const inactive = Number(lengthOfgetData) - (count)
        res.send(`active status = ${count}, inActive Status = ${inactive}`)
    } catch (error) {
        // console.log(error);
        res.send(error)
    }
})

/********************* logout in current device router api router. *********************/

router.get("/logout", auth, async (req, res) => {
    try {
        const user = req.user;
        const Remove = req.token
        user.Tokens = await user.Tokens.filter(ele => { ele.token != Remove });
        const dt = await user.save();
        res.send("Logout successful");
    } catch (error) {
        console.error(error);
        res.send(error);
    }
});
module.exports = router