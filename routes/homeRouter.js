const express = require('express');
const router =  express.Router();

const homeController = require('../controllers/homeController.js');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/getRides',auth,homeController.getRides);
router.get('/getUser',auth, homeController.getUser);
router.post('/addCycle',isAdmin, homeController.addCycle);
router.post('/addStand',isAdmin, homeController.addStand);
router.post('/prebook', auth, homeController.prebook);
router.get('/getCycleData/:name',auth, homeController.getAvailabilities);
router.get('/getStats', auth, homeController.getStats);
router.post('/book', auth, homeController.book);

module.exports = router;
