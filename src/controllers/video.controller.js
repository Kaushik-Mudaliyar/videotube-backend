import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  // get the title and description
  // validate the title and description as they are required to publish a video
  // get video and thumbnail by using multer middleware
  // check the video file and thumbnail local path if it is true or not
  // upload the video and thumbnail on cloudinary, check video and thumbnail file
  // create video object in which there will be title,description,video,and thubmnail
  // if successfully created return the res in which there will be the video details

  if (!(title && description)) {
    throw new ApiError(401, "All fields are required!");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Error while uploading video on cloudinary");
  }

  if (!thumbnail) {
    throw new ApiError(400, "Error while uploading thumbnail on cloudinary");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
    isPublished: true,
    // views is pending
  });

  if (!video) {
    throw new ApiError(500, "Something went wrong while publishing the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Published a video successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!videoId) {
    throw new ApiError(400, "Video Id is missing");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video.videoFile, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail

  // videoId is takend from the req.params so i can use it to find the video in the Video model
  // I am getting the title,description from the req.body
  // check whether title and description both are coming in the request
  // by using multer middleware we have access of req.file and from which i am getting the path
  // checks local path
  // upload the thumbnail on cloudinary and check the response
  // delete the previous thumbnail from the cloudinary using deleteOnCloudinary
  // use findbyIdAndUpdate to find by id and provide all the stuff which are going to update and pass new true so it will return the newly created object in the db
  // return response

  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }
  const { title, description } = req.body;
  // both title and description is required
  if (!(title && description)) {
    throw new ApiError(401, "All fields are required");
  }
  // getting thumbnail using multer middleware
  const thubmnailLocalPath = req.file?.path;
  // if we did not get thumbnail then throw error
  if (!thubmnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }
  // if we get it upload the thumbnail file to cloudinary
  const thumbnail = await uploadOnCloudinary(thubmnailLocalPath);
  // if we did not get the url after uploading then we throw error
  if (!thumbnail.url) {
    throw new ApiError(400, "Error while uploading the thumbnail file");
  }

  // after successfully uploading delete the old image
  const existedVideo = await Video.findById(videoId);
  const oldThumbnailUrl = existedVideo.thumbnail;
  const url = new URL(oldThumbnailUrl);
  const path = url.pathname;
  const pathArray = path.split("/");
  const public_id = pathArray[5].split(".")[0];
  // console.log(public_id);

  const deletedResponse = await deleteOnCloudinary(String(public_id, "video"));
  // if (deletedResponse?.result === "ok") {
  //   console.log("Old thumbnail file deleted successfully");
  // }

  // update the new thumbnail, title and description in the db
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Updated video details successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
