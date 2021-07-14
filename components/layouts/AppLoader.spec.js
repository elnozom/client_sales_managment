import { mount } from "@vue/test-utils";
import AppLoader from './AppLoader.vue';




describe("AppLoader", () => {
  test("mounts properly", () => {
    const wrapper =mount(AppLoader);
    // console.log(wrapper)
    expect(wrapper.vm).toBeTruthy();
  });
});