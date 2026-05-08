import Language from "../models/languageModel.js";

export const createLanguage = async (req, res) => {

  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Language name required",
      });
    }

    const exists = await Language.findOne({name});

    if(exists && exists.isDeleted){
        exists.isDeleted = false;
        await exists.save()
        return res.status(200).json({
            success: true,
            message:"Language created successfully",
            language: exists
        })
    }

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Language already exists",
      });
    }

    const language =
      await Language.create({name});

    return res.status(201).json({
      success: true,
      message: "Language created successfully",
      language,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLanguages = async (req, res) => {

  try {

    const languages = await Language.find({isDeleted: false}).sort({name: 1});

    return res.status(200).json({
      success: true,
      languages,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLanguage = async (req, res) => {

  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Language id required",
      });
    }

    const language = await Language.findById(id);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    language.isDeleted = true;

    await language.save();

    return res.status(200).json({
      success: true,
      message:"Language Deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
