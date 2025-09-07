import express from "express" ;
import { protect , restrictTo } from "./../controllers/authController.js"; 
import { createCandidate , getAllCandidates , getCandidatesByCategory } from "../controllers/candiController.js" ; 

const router = express.Router() ;

//to protect and restrict to admin only
router.use(protect) ;
router.use(restrictTo('admin')) ;  
// All routes after this middleware are protected and restricted to admin only

router
    .route('/')
    .post(createCandidate) ; 
router
    .route('/category/:category')
    .get(getCandidatesByCategory) ;
router
    .route('/all')
    .get(getAllCandidates) ;   
