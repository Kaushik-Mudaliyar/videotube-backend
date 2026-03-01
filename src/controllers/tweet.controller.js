import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
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
  if (!content) {
    throw new ApiError(400, "Content field is required");
  }

  // checking the user exist in our db
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
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
