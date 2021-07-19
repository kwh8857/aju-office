import { combineReducers } from "redux";
import config from "./config";
import test from "./test";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import database from "./database";

const persistConfig = {
  key: "root",
  // localStorage에 저장합니다.
  storage,
  whitelist: ["database"],
};
const rootReducers = combineReducers({
  config,
  test,
  database,
});

export default persistReducer(persistConfig, rootReducers);
