import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  const isDbConnected = mongoose.connection.readyState === 1;

  return res.status(isDbConnected ? 200 : 503).json(
    new ApiResponse(
      isDbConnected ? 200 : 503,
      {
        server: "running",
        database: isDbConnected ? "connected" : "disconnected",
        timestamp: new Date(),
      },
      isDbConnected ? "System is healthy" : "database disconnected"
    )
  );
});

export { healthcheck };
