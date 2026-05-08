import Genre from "../models/genreModel.js";

export const createGenre = async (req, res) => {

  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Genre name required",
      });
    }

    const exists = await Genre.findOne({name});

    if(exists && exists.isDeleted){
        exists.isDeleted = false;
        await exists.save()
        return res.status(200).json({
            success: true,
            message:"Genre created successfully",
            genre: exists
        })
    }

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Genre already exists",
      });
    }

    const genre = await Genre.create({name});

    return res.status(201).json({
      success: true,
      message:"Genre created successfully",
      genre,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGenres = async (req, res) => {

  try {

    const genres = await Genre.find({isDeleted: false}).sort({name: 1});

    return res.status(200).json({
      success: true,
      genres,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteGenre = async (req, res) => {

  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Genre id required",
      });
    }

    const genre = await Genre.findById(id);

    if (!genre) {
      return res.status(404).json({
        success: false,
        message: "Genre not found",
      });
    }

    genre.isDeleted = true;

    await genre.save();

    return res.status(200).json({
      success: true,
      message:"Genre Deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
