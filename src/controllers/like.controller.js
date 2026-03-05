import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }
  const isVideoExist = await Video.findById(videoId);
  if (!isVideoExist) {
    throw new ApiError(404, "Video does not exist");
  }
  const likedVideoExist = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });
  let liked, message;
  if (likedVideoExist) {
    await Like.findOneAndDelete({
      video: videoId,
      likedBy: req.user?._id,
    });
    liked = false;
    message = "Video Unliked Successfully";
  } else {
    const like = await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });
    if (!like) {
      throw new ApiError(400, "Error while creating a like");
    }
    liked = true;
    message = "Video Liked Successfully";
  }
  const likesCount = await Like.countDocuments(videoId);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { isLiked: liked, totalLikes: likesCount }, message)
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
