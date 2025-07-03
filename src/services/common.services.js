import axios from 'axios';

export const callThirdPartyAPI = async(apiUrl, apiKey, data) =>{
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling API:', error.message);
  }
}
