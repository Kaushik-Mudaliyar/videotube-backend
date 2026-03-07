import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  // check if videoId is a valid object id or not
  // apply aggregation pipeline to the comment
  // get the comments of using videoId. use match operator
  // we get all the comments now, so sort the comments like the one whose comment is latest will comes first
  // we need to find skip that how many documents we need to skip in each pagination
  // formula for skip = (page-1)*limit
  // after that apply limit operator, it makes sure that all the comments will not load at once, it will come in batches like first 10 comments will be shown then next 10 like that.
  // Now as we know the frontend needs some information about the user as well and we had stored only the id in the db
  // so now we lookup to user model and then unwind the details to get the details inside an object because by default it will give an array
  // after that we project the needed info
  // and then return the response to the user
  const { videoId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const videoComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        ownerId: "$owner._id",
        username: "$owner.username",
        fullName: "$owner.fullName",
        avatar: "$owner.avatar",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoComments, "Fetched video comments successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  // get content from req.body
  // get the user id from the req.user
  // check content
  // create a comment and pass the values
  // check comment
  // return response
  const { videoId } = req.params;
  const { content } = req.body;

  // check videoId is valid
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  // check if content is passed or not
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });

  if (!comment) {
    throw new ApiError(400, "Error while creating the comment in the db");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  // get comment id from req.params
  // check it is a valid object id
  // get comment from req.body
  // check if it is empty or not
  // use find by id and update method to update the comment
  // check comment
  // return response
  const { commentId } = req.params;
  const { content } = req.body;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Comment id is not valid");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: req.user._id },
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedComment) {
    throw new ApiError(404, "Comment with commentId does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  // get comment id from req.params
  // check commentId
  // use the find by id and delete
  // check deleted comment
  // return response

  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }
  const deletedComment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: req.user?._id,
  });
  if (!deletedComment) {
    throw new ApiError(404, "Comment with commentId does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
