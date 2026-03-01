import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  // get content from req.body
  // check content
  // get user from req.user as we used verifyJwt middleware
  // create tweet - pass content, in owner pass the user id
  // check if tweet successfully created
  // return response tweet created successfully

  const { content } = req.body;
  const userId = req.user?._id; // applied verifyJwt so we have access to it

  // check if content filed is empty
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content field is required");
  }

  // creating a tweet
  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  if (!tweet) {
    throw new ApiError(400, "Error while creating tweet in the database");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  // get userId from req.params
  // validate id from isValidObjectId
  // apply aggregation pipeline for owner details
  // match the userid and get all the tweets
  // lookup to the User model to get the fullName, username, avatar
  // check tweets
  // return response

  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User Id");
  }
  const userTweets = await Tweet.aggregate([
    {
      $match: {
        // matching the userId with the owner field in tweet model to find all the user tweets
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      // looking up in user model to get some details
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        // another pipeline to get only fullName,username,avatar
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  if (!userTweets.length) {
    throw new ApiError(400, "User does not tweeted anything yet!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "Get user tweets successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  // get content to update tweet from req.body
  // get tweetId from req.params
  // check tweetId we get from req.params as isValidObjectId
  // isValidObjectId is a method of mongoose which checks if the given id is a valid object id or not and returns true or false
  // using findByIdAndUpdate change the content
  // check updatedTweet
  // return response

  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid TweetId");
  }
  // using findOneAndDelete to check both the user's id and tweet's id
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner: req.user?._id },
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedTweet) {
    throw new ApiError(400, "Error while updating the tweet in db");
  }

  return res
    .status(200)
    .json(new ApiResponse(202, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  // get tweetId from the req.params
  // check tweetId using isValidateObjectId method
  // use the findByIdAndDelete to delete the content
  // check  deletedTweet
  // return response

  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }

  // using findOneAndDelete to check both the user's id and tweet's id
  const deletedTweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: req.user?._id,
  });

  if (!deletedTweet) {
    throw new ApiError(400, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet Deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
