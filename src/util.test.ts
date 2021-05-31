import {
  getOsArchInfo,
} from "./util";

test("can get os arch info", () => {
  const osArchInfo = getOsArchInfo();
  expect(osArchInfo).toBeDefined();
});
