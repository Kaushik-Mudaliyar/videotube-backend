import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
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
    await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });
    liked = true;
    message = "Video Liked Successfully";
  }
  const likesCount = await Like.countDocuments({ video: videoId });
  return res
    .status(200)
    .json(
      new ApiResponse(200, { isLiked: liked, totalLikes: likesCount }, message)
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }
  const isCommentExist = await Comment.findById(commentId);
  if (!isCommentExist) {
    throw new ApiError(404, "Comment does not exist");
  }
  const likeCommentExist = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });
  let isCommentLiked, message;
  if (likeCommentExist) {
    await Like.findOneAndDelete({ comment: commentId, likedBy: req.user?._id });
    isCommentLiked = false;
    message = "Comment Unliked Successfully";
  } else {
    await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
    });
    isCommentLiked = true;
    message = "Comment Liked Successfully";
  }
  const likesCount = await Like.countDocuments({ comment: commentId });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked: isCommentLiked, totalLikes: likesCount },
        message
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }
  const isTweetExist = await Tweet.findById(tweetId);
  if (!isTweetExist) {
    throw new ApiError(400, "Tweet does not exist");
  }
  const isTweetLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });
  let liked, message;
  if (isTweetLiked) {
    await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: req.user?._id,
    });
    liked = false;
    message = "Tweet Unliked Successfully";
  } else {
    await Like.create({
      tweet: tweetId,
      likedBy: req.user?._id,
    });
    liked = true;
    message = "Tweet Liked Successfully";
  }
  let tweetCounts = await Like.countDocuments({ tweet: tweetId });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked: liked, totalTweets: tweetCounts },
        message
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  // get user id from req.user._id
  // match the userid to the like documents
  // and also check if the documents is a video like document
  // now we have the documents of liked videos but all the video have videoId only
  // so lookup to get the details from the video model
  // make sure to unwind the videoDetails field because lookup will provide data in the array
  // unwind converts it into an object
  // then project the necessary details using project operator
  // return response

  const userId = req.user?._id;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $project: {
        videoId: "$videoDetails._id",
        videoFile: "$videoDetails.videoFile",
        thumbnail: "$videoDetails.thumbnail",
        title: "$videoDetails.title",
        description: "$videoDetails.description",
        duration: "$videoDetails.duration",
        owner: "$videoDetails.owner",
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Fetched all liked videos successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
