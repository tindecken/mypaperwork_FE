import axios, { AxiosError } from 'axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';

export default function handleError(error: Error | AxiosError) {
  if (axios.isAxiosError(error)) {
    const e: AxiosError = error;
    if (e.response) {
      // Error handled by the server
      throw e.response?.data as GenericResponseData;
    } else {
      // Error not handled by the server, example "Network Error"
      throw {
        message: e.message,
        success: false,
        statusCode: 500,
      };
    }
  } else {
    throw error;
  }
}
