import { AxiosError } from 'axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';

export default function handleError(error: any) {
  if (error.isAxiosError) {
    const e: AxiosError = error;
    if (e.response) {
      // Error handled by the server
      throw e.response?.data as GenericResponseData;
    } else {
      // Error not handled by the server, example "Network Error"
      const genericResponseData: GenericResponseData = {
        Message: e.message,
        Success: false,
        StatusCode: 500,
      };
      throw genericResponseData;
    }
  } else {
    // Unknown error, maybe error in logic code, not related to calling API by axios
    throw error;
  }
}
