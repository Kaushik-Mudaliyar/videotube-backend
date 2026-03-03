import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist
  // get the name, description, and visibility from the req.body
  // get the user's id from req.user
  // check name and description
  // create playlist
  const { name, description, visibility } = req.body;
  if (!name.trim() || !description.trim() || !visibility) {
    throw new ApiError(
      400,
      "Name, description and visibility of playlist is required while creating a playlist"
    );
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
    visibility,
  });

  if (!playlist) {
    throw new ApiError(400, "Error while creating the playlist");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  // check userId whether it is a validObjectId or not
  // use find with the owner's id and get all the playlist
  // check response
  // return the response

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User Id is not Valid");
  }

  let filter = { owner: userId };

  // If requesting someone else's playlists
  if (req.user._id.toString() !== userId) {
    filter.visibility = "public";
  }

  const userPlaylist = await Playlist.find(filter);

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "User Playlist fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  // get playlistId from req.params
  // check playlistId is a validObjectId or not
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }
  const playlist = await Playlist.findOne({
    _id: playlistId,
    $or: [{ visibility: "public" }, { owner: req.user._id }],
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found ");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Fetched Playlist by Id successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // get playlistId, videoId from req.params
  // check playlistId and videoId are valid objectid
  // check if video is there in the db
  // find the playlist with the playlistId with the owner
  // set the videos to videoId
  // check the playlist
  // return response

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: req.user._id },
    {
      $addToSet: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found or you are not the owner");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: req.user._id },
    {
      $pull: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedPlaylist) {
    throw new ApiError(400, "Playlist not found or unauthorized");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Removed the video from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
