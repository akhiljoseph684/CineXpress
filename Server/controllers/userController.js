import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {

    try {

      let {
        name,
        role,
        status,
        page,
        limit
      } = req.query;

      let filter = {
        isDeleted: false
      };

      if (role) {
        filter.role = role;
      }

      if (status && status !== "all") {
        filter.status = status;
      }

      if (name?.trim()) {

          filter.$or = [
          {
            name: {
              $regex:
                name.trim(),
            
              $options: "i"
            }
          },
          {
            email: {
              $regex:
                name.trim(),
            
              $options: "i"
            }
          }
        
        ];
      }

      const pageNumber = Number(page) || 1;

      const limitNumber = Number(limit) || 12;

      const skip = (pageNumber - 1) * limitNumber;

      const result =
        await User.aggregate([

          {
            $match: filter
          },

          {
            $facet: {

              users: [

                {
                  $sort: {
                    createdAt: -1
                  }
                },

                {
                  $skip: skip
                },

                {
                  $limit:
                    limitNumber
                }

              ],

              totalCount: [

                {
                  $count: "count"
                }
              ]
            }
          }
        ]);

      const users = result[0].users;
      const totalUsers = result[0].totalCount[0]?.count || 0;

      const totalPages = Math.ceil( totalUsers / limitNumber );

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        users,
        totalUsers,
        totalPages,
        currentPage: pageNumber

      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong"
      });
    }
};

export const getUserById = async (req, res) => {

    try {

      const { id } =
        req.params;

      if (!id) {

        return res.status(400).json({
          success: false,
          message:
            "Id is required"
        });
      }

      const user =
        await User.findOne({
          _id: id,
          isDeleted: false
        });

      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      });
    }
};

export const deleteUser = async (req, res) => {

    try {

      const { id } =
        req.params;

      const user = await User.findOneAndUpdate(
          {
            _id: id,
            isDeleted: false
          },

          {
            isDeleted: true
          },
          {
            new: true
          }
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      });
    }
};

export const blockUser = async (req, res) => {

    try {

      const { id } = req.params;

      const { block } = req.body;

      const user = await User.findOne({  _id: id, isDeleted: false });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      user.status = block ? "blocked" : "active";

      await user.save();

      return res.status(200).json({
        success: true,
        message: block ? "User blocked successfully" : "User unblocked successfully",
        user
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

export const updateUser = async (req, res) => {
    try {

        const userId = req.user.id;

        const { name, phone, avatar, preferredCity } = req.body;

        const updatedUser = await User.findOneAndUpdate(
                {
                    _id: userId,
                    isDeleted: false
                },
                {
                    ...(name && { name }),
                    ...(avatar && { avatar }),
                    ...(preferredCity && { preferredCity})
                },
                {
                    returnDocument: "after"
                }
            ).select("-password -refreshToken");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};