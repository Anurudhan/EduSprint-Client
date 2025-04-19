import { createAsyncThunk } from "@reduxjs/toolkit";
import { CourseEntity } from "../../../../types/ICourse";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

export const addCourse = createAsyncThunk(
  "course/addCourse",
  async (data: CourseEntity, { rejectWithValue }) => {
    try {
      const response = await CLIENT_API.post("/course/", { ...data }, config);

      // Check if the response indicates success
      if (response.data.success) {
        return response.data; // Return the successful data
      } else {
        // Reject with the error message if not successful
        return rejectWithValue(response.data.message || "Something went wrong!");
      }
    } catch (error: unknown) {
      // Handle any errors that occur during the request
      const e: AxiosError = error as AxiosError;

      // Reject with error response or message, fall back to a generic message
      return rejectWithValue(e.response?.data || e.message || "An unexpected error occurred");
    }
  }
);
