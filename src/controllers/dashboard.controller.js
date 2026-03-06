import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user?._id;

  // total videos
  const totalVideos = await Video.countDocuments({ owner: userId });
  // total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });
  // total all video views
  const totalVideoViews = await Video.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  const totalViews = totalVideoViews[0]?.totalViews || 0;

  // total likes
  const likes = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $match: {
        "video.owner": new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $count: "totalLikes",
    },
  ]);
  const totalLikes = likes[0]?.totalLikes || 0;

  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalSubscribers,
      totalViews,
      totalLikes,
    })
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
});

export { getChannelStats, getChannelVideos };
