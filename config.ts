import * as Constants from "expo-constants";

const Container = Constants.default.expoConfig?.extra?.api;

const AIML_API_KEY = Container?.api_key;
const BASE_URL = Container?.main_url;

export { AIML_API_KEY, BASE_URL };
