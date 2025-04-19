import { createAsyncThunk } from "@reduxjs/toolkit";
import { CourseEntity } from "../../../../types/ICourse";
import { AxiosError } from "axios";
import { CLIENT_API } from "../../../../utilities/axios/instance";
import { config } from "../../../../common/config";

export const editCourse = createAsyncThunk(
  "course/edit",
  async (data: { data: CourseEntity; studentId: string | null; incrementStudentsEnrolled?: boolean }, { rejectWithValue }) => {
    try {
      const response = await CLIENT_API.post("/course/updatecourse", data, config);

      if (response.data.success) {
        return response.data; // success response will be returned
      } else {
        // If the response is not successful, reject with the message
        return rejectWithValue(response.data.message || "Something went wrong!");
      }
    } catch (error: unknown) {
      // Handling the error when the request fails
      const e: AxiosError = error as AxiosError;
      // Reject with error response or message
      return rejectWithValue(e.response?.data || e.message || "An unexpected error occurred");
    }
  }
);
