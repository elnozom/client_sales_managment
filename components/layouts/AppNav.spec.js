import {  mount } from "@vue/test-utils";
import AppNav from './AppNav.vue';

// import { localVue, i18n , vuetify } from '~/utils/TestUtils'


describe("AppNav", () => {
  test("mounts properly", () => {
    const wrapper =mount(AppNav );
    // console.log(wrapper)
    expect(wrapper.vm).toBeTruthy();
  });


  // test that switch language button works
  
  
  // test that switch  theme button works
});