import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
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
    throw new ApiError(400, "Error while updating the comment");
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
    throw new ApiError(400, "Error while deleting the comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
