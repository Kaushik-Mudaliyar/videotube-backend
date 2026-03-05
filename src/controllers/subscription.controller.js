import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  // get channelId from req.params
  // check channelid is a valid object id
  // check channel user exists in the user model
  // get subscriberId from req.user._id
  // check if channelid is eqaul to userid then it is not possible because a user A can subscribe or unsubscribe to user B not itself.
  // if they are equal reject the request
  // check if subscription already exists
  // search the subscription model and filter the documents based on the channelId and subscriberId
  // if it exists in the subscription document then we need to delete it
  // else if it does not exist we need to create a new document
  // if it was delted then we return response that we unsubscribed the channel
  // if it was created then we return response that we subscribed the channel

  const { channelId } = req.params;
  const subscriberId = req.user?._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel Id ");
  }

  const isChannelExist = await User.findById(channelId);
  if (!isChannelExist) {
    throw new ApiError(404, "Channel does not exist");
  }

  if (subscriberId.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  const isSubscriptionExist = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  let Subscribed, message;

  if (isSubscriptionExist) {
    await Subscription.findOneAndDelete({
      subscriber: subscriberId,
      channel: channelId,
    });
    Subscribed = false;
    message = "Unsubscribed Successfully";
  } else {
    const createSubscription = await Subscription.create({
      subscriber: subscriberId,
      channel: channelId,
    });
    if (!createSubscription) {
      throw new ApiError(400, "Error while creating the subscription");
    }
    Subscribed = true;
    message = "Subscribed Successfully";
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { isSubscribed: Subscribed }, message));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  const subscribers = await Subscription.aggregate([
    {
      // match the channel based on our channel id
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      // lookup to the user to find the details of the subscriber
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      // after lookup we get an array of subscriber Details to convert it to an object we can use unwind operator to convert the array of subscriber to the object of subscriber
      $unwind: "$subscriberDetails",
    },
    {
      // we had lookup from the users so we got all the details but we just want to show some details only like username,fullname,userid and avatar. so we use project to show some details only
      $project: {
        subscriberId: "$subscriberDetails._id",
        username: "$subscriberDetails.username",
        avatar: "$subscriberDetails.avatar",
        fullName: "$subscriberDetails.fullName",
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "Fetched User Channel subscribers successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  // we finding here the list of channels which was subscribed by the subscriber
  if (!isValidObjectId(subscriberId)) {
    throw ApiError(400, "Invalid subscriber Id");
  }

  const channels = await Subscription.aggregate([
    {
      // match the subscriber based on the subscriberId
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      // lookup to the user model to get details of the channel which the subscriber is subscribed
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      // convert the array of channelDetails to an object
      $unwind: "$channelDetails",
    },
    {
      // project some things only from the lookup
      $project: {
        channelId: "$channelDetails._id",
        username: "$channelDetails.username",
        avatar: "$channelDetails.avatar",
        fullName: "$channelDetails.fullName",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channels,
        "Fetched Channel Subscribed To successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
