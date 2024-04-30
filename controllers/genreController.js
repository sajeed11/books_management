import autoBind from "auto-bind";
import BaseController from "./baseController.js";
import GenreModel from "../models/Genre.js";


class GenreController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }
}

const genreModel = new GenreModel('genres')

export default new GenreController(genreModel)